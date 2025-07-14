export const getEmailHref = () => {
  const email = 'hello@cantinbartel.dev'
  // fallback pour le cas SSR
  if (typeof window === 'undefined') {
    return `mailto:${email}`
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isFrench = window.location.hostname.startsWith('fr.')

  const subject = isFrench
    ? 'Demande de collaboration'
    : 'Collaboration request'

  const body = isFrench
    ? `Bonjour Cantin,\n\nJ'ai une idée de projet..`
    : 'Hi Cantin,\n\nI have a project idea...'

  const queryParams = new URLSearchParams()
  queryParams.append('su', subject)
  queryParams.append('body', body)

  if (isMobile) {
    return `mailto:${email}?${queryParams.toString()}`
  }

  return `https://mail.google.com/mail/?view=cm&to=${email}&${queryParams.toString()}`
}
