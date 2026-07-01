// Simple AI Summary without API key

const generateSummary = (transcript) => {
  if (!transcript || transcript.length === 0) {
    return 'No transcript available for this meeting.'
  }

  const sentences = transcript
    .split('.')
    .filter(s => s.trim().length > 10)
    .slice(0, 5)

  return sentences.join('. ') + '.'
}

const extractActionItems = (transcript) => {
  const actionKeywords = [
    'will',
    'should',
    'need to',
    'must',
    'action',
    'todo',
    'follow up',
    'assign',
    'deadline',
    'complete'
  ]

  const sentences = transcript.split('.')

  return sentences
    .filter(sentence => {
      const lower = sentence.toLowerCase()
      return actionKeywords.some(keyword => lower.includes(keyword))
    })
    .slice(0, 5)
    .map(item => item.trim())
}

const analyzeTranscript = (transcript) => {
  return {
    summary: generateSummary(transcript),
    actionItems: extractActionItems(transcript),
    wordCount: transcript.split(' ').length,
    duration: Math.ceil(transcript.split(' ').length / 130) + ' minutes'
  }
}

module.exports = {
  generateSummary,
  extractActionItems,
  analyzeTranscript
}