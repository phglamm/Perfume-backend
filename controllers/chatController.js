const axios = require("axios");

const sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Prepare the conversation history for the API
    const messages = [
      {
        role: "assistant",
        content:
          "You are a helpful assistant for a perfume e-commerce website. You can help customers with perfume recommendations, product information, fragrance notes, and general shopping assistance. Be friendly, knowledgeable, and helpful.",
      },
      ...conversationHistory,
      {
        role: "user",
        content: message,
      },
    ];

    // Make request to OpenRouter AI
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "tngtech/deepseek-r1t2-chimera:free", // Using a free model, you can change this
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHATBOT_KEY}`,
          "HTTP-Referer": "http://localhost:5000", // Your site URL
          "X-Title": "Perfume E-commerce Chatbot", // Your site title
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    res.json({
      success: true,
      message: aiResponse,
      conversationHistory: [
        ...conversationHistory,
        { role: "user", content: message },
        { role: "assistant", content: aiResponse },
      ],
    });
  } catch (error) {
    console.error(
      "Error in chat controller:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message:
        "Sorry, I encountered an error while processing your message. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getAvailableModels = async (req, res) => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.CHATBOT_KEY}`,
        "HTTP-Referer": "http://localhost:5000", // Your site URL
        "X-Title": "Perfume E-commerce Chatbot", // Your site title
        "Content-Type": "application/json",
      },
    });

    res.json({
      success: true,
      models: response.data.data.filter(
        (model) => model.pricing.prompt === "0" || model.id.includes("free")
      ),
    });
  } catch (error) {
    console.error(
      "Error fetching models:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Error fetching available models",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  sendMessage,
  getAvailableModels,
};
