import random
import base64
import hashlib
import secrets


class PBKDF2PasswordHasher():
    """
    Secure password hashing using the PBKDF2 algorithm (recommended)

    Configured to use PBKDF2 + HMAC + SHA256.
    The result is a 64 byte binary string.  Iterations may be changed
    safely but you must rename the algorithm if you change SHA256.
    """
    algorithm = "pbkdf2_sha256"
    iterations = 100000
    digest = hashlib.sha256

    @staticmethod
    def get_random_string(length=12,
                        allowed_chars='abcdefghijklmnopqrstuvwxyz'
                                        'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'):
        """
        Return a securely generated random string.

        The default length of 12 with the a-z, A-Z, 0-9 character set returns
        a 71-bit value. log_2((26+26+10)^12) =~ 71 bits
        """
        return ''.join(random.choice(allowed_chars) for i in range(length))

    def salt(self):
        """Generate a cryptographically secure nonce salt in ASCII."""
        return self.get_random_string()

    def hash_password(self, password, salt=None, iterations=None):
        assert password is not None and isinstance(password, str)
        if salt is None:
            salt = self.salt()
        assert salt and isinstance(salt, str) and "$" not in salt
        if not iterations:
            iterations = self.iterations
        pw_hash = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations
        )
        b64_hash = base64.b64encode(pw_hash).decode("ascii").strip()
        return "{}${}${}${}".format(self.algorithm, iterations, salt, b64_hash)

    def verify(self, password, password_hash):
        algorithm, iterations, salt, b64_hash = password_hash.split("$", 3)
        iterations = int(iterations)
        assert algorithm == self.algorithm
        compare_hash = self.hash_password(password, salt, iterations)
        return secrets.compare_digest(password_hash, compare_hash)


def make_password(password, salt=None, hasher='default'):
    """
    Turn a plain-text password into a hash for database storage

    Same as encode() but generate a new random salt. If password is None then
    return a concatenation of UNUSABLE_PASSWORD_PREFIX and a random string,
    which disallows logins. Additional random string reduces chances of gaining
    access to staff or superuser accounts. See ticket #20079 for more info.
    """
    hasher = PBKDF2PasswordHasher()
    return hasher.hash_password(password)


def check_password(password, password_hash):
    """
    Return a boolean of whether the raw password matches the three
    part encoded digest.
    """
    if not password:
        return False

    hasher = PBKDF2PasswordHasher()
    return hasher.verify(password, password_hash)


if __name__ == '__main__':
    """To test the hashing working try with `python hashers.py`
    """
    password = 'new-password'
    password_hash = make_password(password)
    password_match = check_password(password, password_hash)
    print('password: ', password)
    print('password_hash: ', password_hash)
    print('password_match: ', password_match)
