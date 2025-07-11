const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '13.82.106.83',
  port: 3306,
  user: 'predict_admin',
  password: '!7#X9qL$2sP!vE5*K!',
  database: 'predictDB',
  connectTimeout: 30000
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createPredictionsTable = `
    CREATE TABLE IF NOT EXISTS predictions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      source_type ENUM('YouTube', 'X', '自己') NOT NULL,
      link VARCHAR(255),
      predictor VARCHAR(255) NOT NULL,
      asset ENUM('BTC', 'ETH', 'NVDA', 'TSLA') NOT NULL,
      current_price FLOAT,
      predicted_price_min FLOAT,
      predicted_price_max FLOAT,
      time_frame_days INT,
      prediction_type ENUM('方向', '区间', '策略型') NOT NULL,
      description TEXT,
      status ENUM('进行中', '失败', '成功') DEFAULT '进行中',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  db.query(createUsersTable, (err, result) => {
    if (err) throw err;
    console.log('Users table created or already exists.');
  });

  db.query(createPredictionsTable, (err, result) => {
    if (err) throw err;
    console.log('Predictions table created or already exists.');
  });

  const createAppRegistrationsTable = `
    CREATE TABLE IF NOT EXISTS app_registrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      app_name VARCHAR(255) NOT NULL UNIQUE,
      public_key VARCHAR(512) NOT NULL,
      private_key VARCHAR(512) NOT NULL,
      license_type ENUM('free', 'basic', 'pro', 'enterprise') NOT NULL DEFAULT 'free',
      max_calls_per_day INT DEFAULT 100,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_used_at TIMESTAMP NULL,
      is_active BOOLEAN DEFAULT TRUE
    );
  `;

  const createApiCallLogsTable = `
    CREATE TABLE IF NOT EXISTS api_call_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      app_id INT NOT NULL,
      endpoint VARCHAR(255) NOT NULL,
      called_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (app_id) REFERENCES app_registrations(id)
    );
  `;

  db.query(createAppRegistrationsTable, (err, result) => {
    if (err) throw err;
    console.log('App registrations table created or already exists.');
  });

  db.query(createApiCallLogsTable, (err, result) => {
    if (err) throw err;
    console.log('API call logs table created or already exists.');
  });
});

// API Endpoints

// Middleware to validate API key and check rate limits
const validateApiKey = async (req, res, next) => {
  const publicKey = req.headers['x-api-key'];
  if (!publicKey) {
    return res.status(401).send('API key required');
  }

  try {
    // Get app registration
    const [app] = await db.promise().query(
      'SELECT * FROM app_registrations WHERE public_key = ? AND is_active = TRUE',
      [publicKey]
    );

    if (!app.length) {
      return res.status(403).send('Invalid API key');
    }

    // Check daily call limit
    const [count] = await db.promise().query(
      `SELECT COUNT(*) as count FROM api_call_logs 
       WHERE app_id = ? AND called_at >= CURDATE()`,
      [app[0].id]
    );

    if (count[0].count >= app[0].max_calls_per_day) {
      return res.status(429).send('Daily API call limit exceeded');
    }

    // Log the API call
    await db.promise().query(
      'INSERT INTO api_call_logs (app_id, endpoint) VALUES (?, ?)',
      [app[0].id, req.path]
    );

    // Update last used timestamp
    await db.promise().query(
      'UPDATE app_registrations SET last_used_at = NOW() WHERE id = ?',
      [app[0].id]
    );

    req.app = app[0];
    next();
  } catch (err) {
    console.error('API key validation error:', err);
    return res.status(500).send('Internal server error');
  }
};

// User registration
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
    db.query(query, [username, password, email], (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(201).send('User registered successfully.');
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    if (result.length > 0) {
      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful.', token });
      } else {
        res.status(401).send('Invalid credentials.');
      }
    } else {
      res.status(401).send('Invalid credentials.');
    }
  });
});

// Submit a new prediction
app.post('/api/predictions', validateApiKey, (req, res) => {
  const { user_id, source_type, link, predictor, asset, current_price, predicted_price_min, predicted_price_max, time_frame_days, prediction_type, description } = req.body;
  const query = 'INSERT INTO predictions (user_id, source_type, link, predictor, asset, current_price, predicted_price_min, predicted_price_max, time_frame_days, prediction_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [user_id, source_type, link, predictor, asset, current_price, predicted_price_min, predicted_price_max, time_frame_days, prediction_type, description], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).send('Prediction submitted successfully.');
  });
});

// Get all predictions
app.get('/api/predictions', validateApiKey, (req, res) => {
  const query = 'SELECT * FROM predictions';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Get predictions by asset
app.get('/api/predictions/:asset', validateApiKey, (req, res) => {
  const { asset } = req.params;
  const query = 'SELECT * FROM predictions WHERE asset = ?';
  db.query(query, [asset], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// Middleware to validate user token
const validateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access token required');
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }
    req.user = user;
    next();
  });
};

// Register new application and generate API keys
app.post('/api/applications/register', validateToken, (req, res) => {
  const { app_name, license_type } = req.body;
  
  // Generate random public/private key pair
  const publicKey = require('crypto').randomBytes(32).toString('hex');
  const privateKey = require('crypto').randomBytes(32).toString('hex');
  
  // Set call limits based on license type
  let max_calls_per_day;
  switch(license_type) {
    case 'free':
      max_calls_per_day = 100;
      break;
    case 'basic':
      max_calls_per_day = 1000;
      break;
    case 'pro':
      max_calls_per_day = 10000;
      break;
    case 'enterprise':
      max_calls_per_day = 100000;
      break;
    default:
      return res.status(400).send('Invalid license type');
  }

  const query = `
    INSERT INTO app_registrations 
    (app_name, public_key, private_key, license_type, max_calls_per_day)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, 
    [app_name, publicKey, privateKey, license_type, max_calls_per_day], 
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.status(201).json({
        app_id: result.insertId,
        public_key: publicKey,
        private_key: privateKey,
        license_type,
        max_calls_per_day
      });
    }
  );
});

// Get API usage statistics
app.get('/api/applications/usage', validateToken, (req, res) => {
  const publicKey = req.headers['x-api-key'];
  
  db.query(
    `SELECT 
      ar.app_name,
      ar.license_type,
      ar.max_calls_per_day,
      COUNT(acl.id) as calls_today,
      ar.max_calls_per_day - COUNT(acl.id) as remaining_calls,
      ar.last_used_at
    FROM app_registrations ar
    LEFT JOIN api_call_logs acl ON 
      acl.app_id = ar.id AND 
      acl.called_at >= CURDATE()
    WHERE ar.public_key = ?
    GROUP BY ar.id`,
    [publicKey],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!results.length) {
        return res.status(404).send('Application not found');
      }
      res.json(results[0]);
    }
  );
});

// Update application details
app.put('/api/applications/update', validateToken, (req, res) => {
  const { app_name, license_type } = req.body;
  const publicKey = req.headers['x-api-key'];
  
  // Validate license type
  const validLicenses = ['free', 'basic', 'pro', 'enterprise'];
  if (license_type && !validLicenses.includes(license_type)) {
    return res.status(400).send('Invalid license type');
  }

  // Get current app details
  db.query(
    'SELECT * FROM app_registrations WHERE public_key = ?',
    [publicKey],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!results.length) {
        return res.status(404).send('Application not found');
      }

      const currentApp = results[0];
      const newAppName = app_name || currentApp.app_name;
      const newLicenseType = license_type || currentApp.license_type;

      // Calculate new call limit if license type changed
      let newCallLimit = currentApp.max_calls_per_day;
      if (license_type && license_type !== currentApp.license_type) {
        switch(license_type) {
          case 'free': newCallLimit = 100; break;
          case 'basic': newCallLimit = 1000; break;
          case 'pro': newCallLimit = 10000; break;
          case 'enterprise': newCallLimit = 100000; break;
        }
      }

      // Update in database
      db.query(
        `UPDATE app_registrations 
         SET app_name = ?, license_type = ?, max_calls_per_day = ?
         WHERE id = ?`,
        [newAppName, newLicenseType, newCallLimit, currentApp.id],
        (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(200).json({
            app_name: newAppName,
            license_type: newLicenseType,
            max_calls_per_day: newCallLimit
          });
        }
      );
    }
  );
});

// Rotate API keys for an existing application
app.post('/api/applications/rotate-keys', validateToken, (req, res) => {
  const { private_key } = req.body;
  const publicKey = req.headers['x-api-key'];
  
  // Verify private key matches
  db.query(
    'SELECT * FROM app_registrations WHERE public_key = ? AND private_key = ?',
    [publicKey, privateKey],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!results.length) {
        return res.status(403).send('Invalid private key');
      }

      // Generate new key pair
      const newPublicKey = require('crypto').randomBytes(32).toString('hex');
      const newPrivateKey = require('crypto').randomBytes(32).toString('hex');

      // Update keys in database
      db.query(
        'UPDATE app_registrations SET public_key = ?, private_key = ? WHERE id = ?',
        [newPublicKey, newPrivateKey, results[0].id],
        (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          res.status(200).json({
            new_public_key: newPublicKey,
            new_private_key: newPrivateKey,
            license_type: results[0].license_type,
            max_calls_per_day: results[0].max_calls_per_day
          });
        }
      );
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
