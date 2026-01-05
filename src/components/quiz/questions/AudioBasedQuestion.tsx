import React, { useState, useRef, useEffect } from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { useTranslation } from '../../../hooks/useTranslation';

interface AudioBasedQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

export const AudioBasedQuestion: React.FC<AudioBasedQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
}) => {
  const { getLocalizedContent } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');

  // Initialize text answer
  useEffect(() => {
    const initialText = Array.isArray(answer) ? answer[0] || '' : answer || '';
    setTextAnswer(initialText);
  }, [answer]);

  const handleTextChange = (value: string) => {
    if (isDisabled) return;
    
    setTextAnswer(value);
    onAnswerChange(value);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (currentTime === 0) {
        setPlayCount(prev => prev + 1);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlayCount(prev => prev + 1);
    }
  };

  if (!question.media_url) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">No audio file provided for this question.</p>
      </div>
    );
  }

  return (
    <div className="audio-based-question">
      {/* Audio Player */}
      <div className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Audio Content</h4>
            <div className="text-sm text-gray-600">
              Played: {playCount} time{playCount !== 1 ? 's' : ''}
            </div>
          </div>

          {audioError ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-600 mb-2">Failed to load audio</p>
              <button
                onClick={() => setAudioError(false)}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <audio
                ref={audioRef}
                src={question.media_url}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => setAudioError(true)}
                preload="metadata"
              />

              {/* Audio Controls */}
              <div className="space-y-4">
                {/* Play/Pause and Replay Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={togglePlayPause}
                    className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    disabled={audioError}
                  >
                    {isPlaying ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={handleReplay}
                    className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                    disabled={audioError}
                    title="Replay from beginning"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                    </svg>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    disabled={audioError}
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Audio Instructions */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            🎧 Listen to the audio carefully and answer the question below. You can replay the audio as many times as needed.
          </p>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 leading-relaxed">
          {getLocalizedContent(question.question)}
        </h3>
      </div>

      {/* Answer Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Answer:
        </label>
        <textarea
          value={textAnswer}
          onChange={(e) => handleTextChange(e.target.value)}
          disabled={isDisabled}
          className={`w-full p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            isSubmitted 
              ? 'border-blue-300 bg-blue-50' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
          rows={6}
          placeholder="Write your answer based on what you heard in the audio..."
        />
      </div>

      {/* Word Count */}
      <div className="flex justify-end text-sm text-gray-600 mb-4">
        <span>
          Words: {textAnswer.trim() ? textAnswer.trim().split(/\s+/).length : 0}
        </span>
      </div>

      {/* Listening Tips */}
      {!isSubmitted && textAnswer.length < 20 && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-2">Listening Tips:</h5>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Listen for key words and main ideas</li>
            <li>• Pay attention to tone and context</li>
            <li>• Take notes while listening if helpful</li>
            <li>• Don't worry if you don't understand every word</li>
          </ul>
        </div>
      )}

      {/* Submission Status */}
      {isSubmitted && (
        <div className="mt-4">
          <div className="flex items-center text-blue-700 bg-blue-50 p-3 rounded-lg">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="font-medium">Answer submitted successfully!</span>
              <div className="text-sm mt-1">
                Your response has been recorded and will be reviewed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Answer (if provided and showing correct answers) */}
      {isSubmitted && showCorrectAnswer && question.correct_answer && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Sample Answer:</h4>
          <div className="text-green-800 text-sm leading-relaxed whitespace-pre-wrap">
            {Array.isArray(question.correct_answer) 
              ? question.correct_answer[0] 
              : question.correct_answer}
          </div>
        </div>
      )}

      {/* Custom Styles for Range Slider */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};