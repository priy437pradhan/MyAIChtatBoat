import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Track selected question

  const customQuestions = [
    {
      question: "What are your store hours?",
      options: [
        { option: "Weekdays", answer: "Our store hours are Monday to Friday, 9 AM to 6 PM." },
        { option: "Weekends", answer: "Our store is closed on weekends." }
      ]
    },
    {
      question: "Can I return a purchased item?",
      options: [
        { option: "Within 30 days", answer: "Yes, you can return items within 30 days of purchase." },
        { option: "After 30 days", answer: "Returns are not accepted after 30 days." }
      ]
    },
    // Add more custom questions as needed
  ];

  async function generateAnswer(e) {
    e.preventDefault();
    setGeneratingAnswer(true);
    setAnswer("Loading your answer... \n It might take up to 10 seconds");

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const newAnswer = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setAnswer(newAnswer);

      setChatHistory([...chatHistory, { question, answer: newAnswer }]);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");

      setChatHistory([...chatHistory, { question, answer: "Sorry - Something went wrong. Please try again!" }]);
    }

    setQuestion(""); 
    setGeneratingAnswer(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateAnswer(e);
    }
  }

  function handleCustomQuestion(questionText, options) {
    setQuestion(questionText); 
    setSelectedQuestion({ question: questionText, options }); 
  }

  function handleOption(optionText, answerText) {
    setQuestion(""); 
    setAnswer(answerText); 
    setChatHistory([...chatHistory, { question: selectedQuestion.question, answer: answerText }]);
    setSelectedQuestion(null);
  }

  return (
    <div className="flex justify-center items-center">
    <div className="w-96 bg-gradient-to-r from-blue-50 to-blue-100 h-screen p-3 flex flex-col justify-between">
      <div className="flex flex-col space-y-4 overflow-auto mb-4">
        {chatHistory.map((chat, index) => (
          <div key={index} className="flex flex-col">
            <div className="self-end bg-blue-500 text-white p-3 rounded-lg max-w-xs w-fit shadow-lg mb-2">
              {chat.question}
            </div>
            <div className="self-start bg-white text-black p-3 rounded-lg max-w-xs w-fit shadow-lg">
              <ReactMarkdown>{chat.answer}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        {!selectedQuestion ? (
          <>
            <div className="flex absolute bottom-32 flex-col flex-wrap gap-2">
              {customQuestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCustomQuestion(item.question, item.options)}
                  className="bg-green-300 text-green-900 p-2 rounded-lg hover:bg-green-400 transition-all duration-300"
                >
                  {item.question}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex absolute bottom-32 flex-col flex-wrap gap-2">
            <h3 className="text-lg font-bold mb-2">Options for {selectedQuestion.question}:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOption(option.option, option.answer)}
                  className="bg-green-300 text-green-900 p-2 rounded-lg hover:bg-green-400 transition-all duration-300"
                >
                  {option.option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={generateAnswer}
        className="w-full flex items-center bg-white p-3 rounded-lg shadow-lg"
      >
        <textarea
          required
          className="border border-gray-300 rounded w-full p-3 min-h-fit transition-all duration-300 focus:border-blue-400 focus:shadow-lg"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyDown}
        ></textarea>
        <button
          type="submit"
          className={`ml-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-all duration-300 ${
            generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={generatingAnswer}
        >
          Send
        </button>
      </form>
    </div>
    </div>
  );
}

export default App;
