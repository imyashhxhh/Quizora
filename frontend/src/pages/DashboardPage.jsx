import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UploadCloud } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../services/apiConnector';
import { quizEndpoints } from '../services/apis';

const DashboardPage = () => {
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a PDF file first.");
            return;
        }
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('pdfFile', selectedFile);

            const response = await apiConnector(
                "POST", 
                quizEndpoints.GENERATE_QUIZ_API, 
                formData, 
                { 'Authorization': `Bearer ${token}` }
            );

            if (!response.data.success) {
                throw new Error(response.data.message);
            }
            
            toast.success("Quiz generated successfully!");
            
            // Pass the quiz data directly during navigation
            navigate('/quiz', { state: { questions: response.data.quiz } });

        } catch (error) {
            const message = error.response?.data?.message || "Quiz generation failed.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-600 via-red-700 to-purple-800 flex items-center justify-center p-4 mt-[-25px]">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold font-unbounded text-gray-900 mb-2">Generate Your Quiz</h1>
                <p className="text-gray-600 mb-8">Upload a 1-page PDF document to get started.</p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                    <UploadCloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <input
                        type="file"
                        id="pdf-upload"
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="pdf-upload" className="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-500">
                        {selectedFile ? `Selected: ${selectedFile.name}` : "Choose a PDF file"}
                    </label>
                    <p className="text-sm text-gray-500 mt-2">Max file size: 10MB</p>
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 disabled:bg-violet-400"
                >
                    {isLoading ? "Generating..." : "Generate Quiz"}
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;




// import React, { useState } from 'react';
// import { UploadCloud } from 'lucide-react';

// const DashboardPage = () => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleFileChange = (event) => {
//         setSelectedFile(event.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!selectedFile) {
//             alert("Please select a PDF file first.");
//             return;
//         }

//         // We will add the API call logic here in the next step
//         console.log("Uploading file:", selectedFile.name);
//         setIsLoading(true);
//         // Placeholder for API call
//         setTimeout(() => {
//             setIsLoading(false);
//             console.log("Upload finished (placeholder).");
//         }, 3000);
//     };

//     return (
//         <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//             <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Your Quiz</h1>
//                 <p className="text-gray-600 mb-8">Upload a PDF document to get started.</p>

//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
//                     <UploadCloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                     <input
//                         type="file"
//                         id="pdf-upload"
//                         className="hidden"
//                         accept=".pdf"
//                         onChange={handleFileChange}
//                     />
//                     <label htmlFor="pdf-upload" className="font-semibold text-indigo-600 cursor-pointer hover:text-indigo-500">
//                         {selectedFile ? `Selected: ${selectedFile.name}` : "Choose a PDF file"}
//                     </label>
//                     <p className="text-sm text-gray-500 mt-2">Max file size: 10MB</p>
//                 </div>

//                 <button
//                     onClick={handleUpload}
//                     disabled={!selectedFile || isLoading}
//                     className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400"
//                 >
//                     {isLoading ? "Generating..." : "Generate Quiz"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default DashboardPage;


