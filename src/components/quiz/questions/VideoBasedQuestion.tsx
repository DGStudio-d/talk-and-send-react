import React, { useState, useRef, useEffect } from 'react';
import { QuizQuestion } from '../../../types/quiz';
import { useTranslation } from '../../../hooks/useTranslation';

interface VideoBasedQuestionProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  isSubmitted?: boolean;
  showCorrectAnswer?: boolean;
  isDisabled?: boolean;
}

export const VideoBasedQuestion: React.FC<VideoBasedQuestionProps> = ({
  question,
  answer,
  onAnswerChange,
  isSubmitted = false,
  showCorrectAnswer = false,
  isDisabled = false,
}) => {
  const { getLocalizedContent } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);

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
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      if (currentTime === 0) {
        setPlayCount(prev => prev + 1);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setPlayCount(prev => prev + 1);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!question.media_url) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">No video file provided for this question.</p>
      </div>
    );
  }

  return (
    <div className="video-based-question">
      {/* Video Player */}
      <div className="mb-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Video Content</h4>
            <div className="text-sm text-gray-600">
              Played: {playCount} time{playCount !== 1 ? 's' : ''}
            </div>
          </div>

          {videoError ? (
            <div className="text-center py-8 bg-gray-100 rounded-lg">
              <svg className="w-12 h-12 mx-auto text-red-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-red-600 mb-2">Failed to load video</p>
              <button
                onClick={() => setVideoError(false)}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Element */}
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={question.media_url}
                  className="w-full h-auto max-h-96 object-contain"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={() => setVideoError(true)}
                  preload="metadata"
                  controls={false}
                />

                {/* Custom Video Controls Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer video-slider"
                      disabled={videoError}
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Play/Pause Button */}
                      <button
                        onClick={togglePlayPause}
                        className="flex items-center justify-center w-10 h-10 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                        disabled={videoError}
                      >
                        {isPlaying ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        )}
                      </button>

                      {/* Replay Button */}
                      <button
                        onClick={handleReplay}
                        className="flex items-center justify-center w-8 h-8 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                        disabled={videoError}
                        title="Replay from beginning"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                        </svg>
                      </button>

                      {/* Time Display */}
                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Volume Control */}
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer volume-slider"
                        />
                      </div>

                      {/* Fullscreen Button */}
                      <button
                        onClick={toggleFullscreen}
                        className="flex items-center justify-center w-8 h-8 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                        disabled={videoError}
                        title="Toggle fullscreen"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video Instructions */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            📹 Watch the video carefully and answer the question below. You can replay the video as many times as needed.
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
          placeholder="Write your answer based on what you saw in the video..."
        />
      </div>

      {/* Word Count */}
      <div className="flex justify-end text-sm text-gray-600 mb-4">
        <span>
          Words: {textAnswer.trim() ? textAnswer.trim().split(/\s+/).length : 0}
        </span>
      </div>

      {/* Viewing Tips */}
      {!isSubmitted && textAnswer.length < 20 && (
        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h5 className="font-medium text-gray-700 mb-2">Viewing Tips:</h5>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>• Watch for visual cues and body language</li>
            <li>• Pay attention to both audio and visual elements</li>
            <li>• Take notes while watching if helpful</li>
            <li>• Consider the context and setting</li>
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

      {/* Custom Styles for Video Controls */}
      <style jsx>{`
        .video-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
        }
        
        .video-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        
        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};