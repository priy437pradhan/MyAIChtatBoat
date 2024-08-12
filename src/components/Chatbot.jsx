import { useState } from 'react';

const customQnA = {
'hii':'hii',
  'Hello': 'Hello',
  'How are you?': 'I am doing well, thank you!',
  'What is your name?': 'My name is Chatbot.',
  'What is your address?': 'Our address is 123 Main St.',
  'What is your phone number?': 'Our phone number is 123-456-7890.',
  'What are your store hours?': 'Our store hours are from 9 AM to 5 PM, Monday through Friday.',
  'How can I contact customer support?': 'You can contact customer support by emailing support@yourstore.com or calling 123-456-7890.',
  'What is your return policy?': 'Our return policy allows returns within 30 days of purchase with a receipt.',
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { type: 'user', text: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      // Check for custom questions
      const customAnswer = customQnA[input.trim()];
      if (customAnswer) {
        const botMessage = { type: 'bot', text: customAnswer };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const botMessage = { type: 'bot', text: 'Sorry, I don’t have an answer to that question.' };
        setMessages((prev) => [...prev, botMessage]);
      }
      
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 border rounded-lg shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="h-64 overflow-y-auto mb-4 bg-white p-4 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-4 py-2 rounded-full ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'} shadow-sm`}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <span className="inline-block px-4 py-2 rounded-full bg-gray-300 text-black shadow-sm">
              Typing...
            </span>
          </div>
        )}
      </div>
      <div className="flex">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" 
          placeholder="Type a message..."
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          className="bg-blue-600 text-white p-3 rounded-r-lg transition-all duration-200 hover:bg-blue-700 shadow-md"
          disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
