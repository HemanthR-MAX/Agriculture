import TranslatedText from './TranslatedText';

const CropAnalysisModal = ({ analysis, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🤖 AI Crop Analysis</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-1 hover:bg-gray-200 rounded-full transition"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">📊 Key Insights</h3>
              <div 
                className="whitespace-pre-wrap text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: analysis.analysis.replace(/\n/g, '<br/>') 
                }} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <span className="text-blue-800 font-semibold">Weather:</span><br/>
                <span className="text-gray-700">{analysis.weather?.summary || 'N/A'}</span>
              </div>
              <div>
                <span className="text-blue-800 font-semibold">Soil:</span><br/>
                <span className="text-gray-700">{analysis.soil?.type || 'N/A'} (pH {analysis.soil?.ph || 'N/A'})</span>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Confidence: {(analysis.confidence * 100).toFixed(0)}%
            </div>

            <div className="text-center pt-4">
              <button 
                onClick={onClose}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition font-medium shadow-lg"
              >
                <TranslatedText>Got it, add crop!</TranslatedText>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropAnalysisModal;
