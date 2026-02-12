const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🏥 Hospital API Server running on http://localhost:${PORT}`);
    console.log(`📊 Frontend available at http://localhost:${PORT}`);
    console.log('🧪 Run tests with: npm test');
});
