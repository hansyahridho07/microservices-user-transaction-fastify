import * as crypto from 'crypto'

function splitEncryptedText(encryptedText: string) {
  return {
    ivString: encryptedText.slice(0, 32),
    encryptedDataString: encryptedText.slice(32),
  }
}

class Security {
  private encoding: BufferEncoding = 'hex'

  // process.env.CRYPTO_KEY should be a 32 BYTE key
  private key: string =
    process.env.CRYPTO_KEY! || '0123456789abcdef0123456789abcdef'

  public encrypt(plaintext: string) {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv('aes-256-cbc', this.key, iv)

      const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf-8'),
        cipher.final(),
      ])

      return iv.toString(this.encoding) + encrypted.toString(this.encoding)
    } catch (e) {
      throw e
    }
  }

  public decrypt(cipherText: string) {
    const { encryptedDataString, ivString } = splitEncryptedText(cipherText)

    try {
      const iv = Buffer.from(ivString, this.encoding)
      const encryptedText = Buffer.from(encryptedDataString, this.encoding)

      const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, iv)

      const decrypted = decipher.update(encryptedText)
      return Buffer.concat([decrypted, decipher.final()]).toString()
    } catch (e) {
      console.error(e)
    }
  }
}

export default new Security()
