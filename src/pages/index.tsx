import { useState } from 'react';
import { getAIOutput } from './api/upload'
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
import { resizeImage } from './api/utils';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [aiOutput, setAiOutput] = useState<string | null>(null);
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
        const img = e.target.files[0];
        const fileExtension = img.name.split('.').pop()?.toLowerCase();
        if (fileExtension === 'jpg' || fileExtension === 'png' || fileExtension === 'jpeg') {
            try {
                const resizedImageUrl = await resizeImage(img);
                setImage(resizedImageUrl);
            } catch (err) {
                setError('Error resizing image.');
                console.error(err);
            }
        } else {
            setError('Invalid file. Must be jpg/jpeg/png');
        }
    }
};

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
  
    if (!image) {
      console.error('No image selected');
      return;
    }
  
    try {
      const response = await getAIOutput(image, apiKey);
      setAiOutput(response); 
      setIsLoading(false);
    } catch (error) {
      console.error('Error getting AI output:', error);
    }
  }

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col items-center py-5">
      <div className='flex items-center justify-center ml-5'>
      <h1 className="text-4xl font-bold text-blue-700 mb-2 ">osintimage.ai</h1>
      <Image  src="/osintimageai.svg" alt={"logo"} width={40} height={40} className='mr-2'/>
    </div>
      <h5 className="text-blue-600 mb-4">AI-Powered OSINT Image Search</h5>
<form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col max-w-md mx-auto w-full">
<input
          type="file"
          onChange={handleImageChange}
          className="mb-4 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
        />
        {/* Display error message if file format is invalid */}
        {error && <p className="text-red-500">{error}</p>}
<input
       type="text"
       value={apiKey}
       onChange={handleApiKeyChange}
       placeholder="Enter Gemini API Key"
       className=" p-2 border rounded text-black"
     />
<p className="text-gray-400 text-[10px] flex justify-end">*osintimage.ai does not store any API keys</p>
 {image && (
<Image
         src={image}
         alt="Uploaded"
         width={32}
         height={32}
         className="mt-4 w-32 h-auto rounded-lg border border-blue-300"
       />
)}
<button
          type="submit"
          disabled={!image || !apiKey || error.length > 0}
          className={`p-2 font-bold rounded mt-5 ${(!image || !apiKey || error) ? 'bg-blue-100 text-white' : 'bg-blue-700 hover:bg-blue-800 text-white'}`}
        >
          Submit
        </button>
        {isLoading && (
          <div className="mt-4 flex justify-center items-center">
            <ClipLoader color="#007bff" size={150} />
          </div>
        )}
{!isLoading && aiOutput && (
    <div className="mt-4 p-4 bg-gray-100 rounded break-words">
    <h3 className="text-lg font-semibold">AI Output:</h3>
    <p>{aiOutput}</p>
  </div>
  )}
</form>
</div>
);
}

export default App;