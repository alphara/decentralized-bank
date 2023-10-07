const conf = {
  contact: {
    email: 'admin@vuics.com'
  },

  api: {
    url: process.env.REACT_APP_API_URL || 'http://localhost:6609/v1',
  },

  interestForm: {
    url: process.env.REACT_APP_INTEREST_FORM_URL || 'https://forms.gle/1qSzm6mGdr1kX49h6',
  },

  // chat: {
  //   limit: 5,
  // }
}

export default conf
