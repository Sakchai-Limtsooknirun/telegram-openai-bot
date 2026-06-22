require('dotenv').config();
const { Telegraf, session } = require('telegraf');
const axios = require('axios');

// Initialize Telegram bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Get API configuration
const API_URL = process.env.LOCAL_AI_URL || 'http://localhost:8000';
const MODEL_NAME = process.env.AI_MODEL || 'qwen';

// Store conversation history per user
const conversationHistory = {};

// Middleware for session management
bot.use(session());

// Function to call local AI API
async function callLocalAI(messages) {
  try {
    const response = await axios.post(`${API_URL}/v1/chat/completions`, {
      model: MODEL_NAME,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: false,
    }, {
      timeout: 30000, // 30 second timeout
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Local AI API Error:', error.message);
    throw error;
  }
}

// Start command
bot.start((ctx) => {
  ctx.reply(
    '👋 Welcome! I\'m an AI bot powered by Local AI.\n\n' +
    '📝 Just send me any message and I\'ll respond using ' + MODEL_NAME + '!\n\n' +
    'Commands:\n' +
    '/start - Show this welcome message\n' +
    '/clear - Clear your conversation history\n' +
    '/help - Show help information',
    {
      reply_markup: {
        keyboard: [
          [{ text: '/clear' }, { text: '/help' }],
        ],
        resize_keyboard: true,
      },
    }
  );
});

// Help command
bot.command('help', (ctx) => {
  ctx.reply(
    '❓ Help & Information\n\n' +
    '• Send any message to chat with AI\n' +
    '• Conversation history is maintained within your session\n' +
    '• /clear - Reset your conversation history\n' +
    '• /start - Show welcome message\n\n' +
    '⚙️ Model: ' + MODEL_NAME +
    '\n🔗 API: ' + API_URL +
    '\n\n' +
    'Powered by Local AI & Telegram'
  );
});

// Clear conversation history
bot.command('clear', (ctx) => {
  const userId = ctx.from.id;
  conversationHistory[userId] = [];
  ctx.reply('✅ Conversation history cleared! Let\'s start fresh.');
});

// Handle text messages
bot.on('message', async (ctx) => {
  const userId = ctx.from.id;
  const userMessage = ctx.message.text;

  // Skip if it's a command
  if (userMessage.startsWith('/')) {
    return;
  }

  // Initialize conversation history for new users
  if (!conversationHistory[userId]) {
    conversationHistory[userId] = [];
  }

  // Show "typing" indicator
  await ctx.sendChatAction('typing');

  try {
    // Add user message to history
    conversationHistory[userId].push({
      role: 'user',
      content: userMessage,
    });

    console.log(`[${new Date().toISOString()}] User ${userId}: ${userMessage}`);

    // Call Local AI API
    const aiMessage = await callLocalAI(conversationHistory[userId]);

    // Add AI response to history
    conversationHistory[userId].push({
      role: 'assistant',
      content: aiMessage,
    });

    // Keep only last 20 messages to avoid memory issues
    if (conversationHistory[userId].length > 20) {
      conversationHistory[userId] = conversationHistory[userId].slice(-20);
    }

    console.log(`[${new Date().toISOString()}] AI Response: ${aiMessage.substring(0, 100)}...`);

    // Split long messages (Telegram limit is 4096 characters)
    if (aiMessage.length > 4096) {
      const chunks = aiMessage.match(/[\s\S]{1,4096}/g) || [];
      for (const chunk of chunks) {
        await ctx.reply(chunk);
      }
    } else {
      await ctx.reply(aiMessage);
    }
  } catch (error) {
    console.error('Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      ctx.reply('❌ Cannot connect to Local AI API. Is it running at ' + API_URL + '?');
    } else if (error.message.includes('timeout')) {
      ctx.reply('⏳ AI request timed out. Please try a shorter message.');
    } else if (error.response?.status === 404) {
      ctx.reply('❌ Model "' + MODEL_NAME + '" not found. Check your AI setup.');
    } else {
      ctx.reply('❌ An error occurred: ' + error.message);
    }
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Telegraf error:', err);
  ctx.reply('❌ An unexpected error occurred. Please try again.');
});

// Start bot
if (process.env.NODE_ENV === 'production') {
  // Webhook mode for production
  const port = process.env.PORT || 3000;
  bot.launch({
    webhook: {
      domain: process.env.WEBHOOK_URL,
      port: port,
    },
  });
  console.log(`🚀 Bot running in webhook mode on port ${port}`);
} else {
  // Polling mode for local development
  bot.launch();
  console.log('🚀 Bot started in polling mode');
  console.log(`📍 Using Local AI at: ${API_URL}`);
  console.log(`🤖 Model: ${MODEL_NAME}`);
}

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
