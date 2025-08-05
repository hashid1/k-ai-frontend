// Mock web search function - In production, you'd integrate with search APIs
export const performWebSearch = async (query, sources = ['web'], apiKey) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock search results based on query and sources
  const mockResults = {
    web: [
      {
        title: `Web Search Results for "${query}"`,
        snippet: `Recent web information about ${query}. This includes current trends, latest developments, and real-time data from various online sources.`,
        url: `https://example.com/search?q=${encodeURIComponent(query)}`,
        domain: 'example.com',
        type: 'web',
        date: new Date().toLocaleDateString()
      }
    ],
    academic: [
      {
        title: `Academic Research on ${query}`,
        snippet: `Peer-reviewed academic papers and scholarly articles related to ${query}. This includes research findings, methodologies, and scientific analysis.`,
        url: `https://scholar.example.com/search?q=${encodeURIComponent(query)}`,
        domain: 'scholar.example.com',
        author: 'Dr. Research Author',
        type: 'academic',
        date: '2024'
      }
    ],
    news: [
      {
        title: `Latest News: ${query}`,
        snippet: `Breaking news and recent developments about ${query}. Current events, market updates, and trending stories from reliable news sources.`,
        url: `https://news.example.com/search?q=${encodeURIComponent(query)}`,
        domain: 'news.example.com',
        author: 'News Reporter',
        type: 'news',
        date: new Date().toLocaleDateString()
      }
    ]
  };

  // Combine results from selected sources
  const results = sources.flatMap(source => mockResults[source] || []);
  
  // Create research summary
  const summary = `Based on web search for "${query}", here are the key findings:\n\n` +
    results.map((result, index) => 
      `${index + 1}. **${result.title}**\n   ${result.snippet}\n   Source: ${result.domain}\n`
    ).join('\n') +
    `\n\nThis research was conducted using ${sources.join(', ')} sources. ` +
    `For the most current information, please refer to the original sources linked above.`;

  return {
    summary,
    citations: results,
    query,
    sources,
    timestamp: new Date().toISOString()
  };
};

export const getResearchPrompt = (mode, query, context = '') => {
  const prompts = {
    comprehensive: `Conduct a comprehensive research analysis on: ${query}

Please provide:
1. Executive Summary
2. Key Findings (with multiple perspectives)
3. Current Trends and Developments
4. Implications and Impact Analysis
5. Future Outlook
6. Recommendations

${context ? `Additional Context: ${context}` : ''}

Please structure your response with clear headings and provide detailed, well-researched information.`,

    academic: `Perform an academic research analysis on: ${query}

Please provide:
1. Literature Review Summary
2. Key Research Findings
3. Methodological Approaches
4. Theoretical Frameworks
5. Research Gaps and Limitations
6. Future Research Directions

${context ? `Additional Context: ${context}` : ''}

Focus on scholarly sources, peer-reviewed research, and academic rigor in your analysis.`,

    market: `Conduct a market analysis research on: ${query}

Please provide:
1. Market Overview and Size
2. Key Players and Competitive Landscape
3. Market Trends and Drivers
4. Opportunities and Challenges
5. Financial Performance Indicators
6. Market Forecast and Projections

${context ? `Additional Context: ${context}` : ''}

Focus on business insights, market data, and commercial implications.`,

    competitive: `Perform competitive intelligence research on: ${query}

Please provide:
1. Competitive Landscape Overview
2. Key Competitors Analysis
3. Strengths and Weaknesses Comparison
4. Market Positioning
5. Strategic Initiatives
6. Competitive Advantages and Threats

${context ? `Additional Context: ${context}` : ''}

Focus on competitor analysis, market positioning, and strategic insights.`,

    trend: `Conduct trend analysis research on: ${query}

Please provide:
1. Current Trend Analysis
2. Emerging Patterns and Signals
3. Historical Context and Evolution
4. Driving Forces and Catalysts
5. Impact Assessment
6. Future Trend Predictions

${context ? `Additional Context: ${context}` : ''}

Focus on identifying patterns, emerging trends, and future implications.`
  };

  return prompts[mode] || prompts.comprehensive;
};

export const formatResearchResponse = (response, citations = []) => {
  let formattedResponse = response;

  // Add citations section if available
  if (citations && citations.length > 0) {
    formattedResponse += '\n\n## Sources and References\n\n';
    citations.forEach((citation, index) => {
      formattedResponse += `[${index + 1}] ${citation.title}\n`;
      if (citation.author) formattedResponse += `   Author: ${citation.author}\n`;
      if (citation.date) formattedResponse += `   Date: ${citation.date}\n`;
      if (citation.url) formattedResponse += `   URL: ${citation.url}\n`;
      formattedResponse += '\n';
    });
  }

  return formattedResponse;
};