export default function replaceLinkTags(idSuffix, lower=false) {
	const linkedinElement = document.querySelector(`#linkedin-link-${idSuffix}`);
	const linkedinUsername = ['r', 'a', 'e', 'd', '-', 'd', 'f', 'w']
	linkedinElement.href = `https://linkedin.com/in/${linkedinUsername.join('')}`
	linkedinElement.textContent = lower ? 'linkedin' : 'LinkedIn'

	const githubElement = document.querySelector(`#github-link-${idSuffix}`)
	const githubUsername = ['r', 'a', 'h', 'm', 'e', 'd', 'd']
	githubElement.href = `https://github.com/${githubUsername.join('')}`
	githubElement.textContent = lower ? 'github' : 'GitHub'

	const gitlabElement = document.querySelector(`#gitlab-link-${idSuffix}`)
	const gitlabUsername = ['r', 'a', 'h', 'm', 'e', 'd', 'd']
	gitlabElement.href = `https://gitlab.com/${gitlabUsername.join('')}`
	gitlabElement.textContent = lower ? 'gitlab' : 'GitLab'
}