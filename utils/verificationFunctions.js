/**
 * handles common verification functions
 */

const generateSecretNumber = ()=> {
    /**
     * generateSecretNumber : generate a number to be sent to user email for verification
     * @returns: number
     */
    return Math.floor(100000 + Math.random()*9000 ).toString()
}

module.exports = { generateSecretNumber }