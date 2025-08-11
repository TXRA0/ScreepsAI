// SHA256 implimentation for hash checking
function sha256(ascii) {
    const chrsz = 8;
    const hexcase = 0;

    function safe_add(x, y) {
        const lsw = (x & 0xFFFF) + (y & 0xFFFF);
        const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }

    function S(X, n) {
        return (X >>> n) | (X << (32 - n));
    }

    function R(X, n) {
        return X >>> n;
    }

    function Ch(x, y, z) {
        return (x & y) ^ (~x & z);
    }

    function Maj(x, y, z) {
        return (x & y) ^ (x & z) ^ (y & z);
    }

    function Sigma0(x) {
        return S(x, 2) ^ S(x, 13) ^ S(x, 22);
    }

    function Sigma1(x) {
        return S(x, 6) ^ S(x, 11) ^ S(x, 25);
    }

    function Gamma0(x) {
        return S(x, 7) ^ S(x, 18) ^ R(x, 3);
    }

    function Gamma1(x) {
        return S(x, 17) ^ S(x, 19) ^ R(x, 10);
    }

    function core_sha256(m) {
        const K = [
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
            0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
            0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
            0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
            0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x3f7e1e43, 0x5f57c1e5, 0x6f9c29d1, 0x7d71bdb9,
            0x8c7b3d2f, 0x9c16c7f2, 0xa49b5c2f, 0xaff4e0b6, 0xc1cc2b56, 0xd2029c6e
        ];

        const H = [
            0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
            0x1f83d9ab, 0x5be0cd19
        ];

        m.push(0x80);
        while ((m.length % 64) !== 56) {
            m.push(0x00);
        }

        const l = m.length * chrsz;
        for (let i = 0; i < 8; i++) {
            m.push((l >>> ((7 - i) * 8)) & 0xff);
        }

        let w = [];
        for (let i = 0; i < m.length; i += 64) {
            let j = 0;
            for (let k = 0; k < 16; k++) {
                w[k] = ((m[i + j] << 24) | (m[i + j + 1] << 16) | (m[i + j + 2] << 8) | (m[i + j + 3])) >>> 0;
                j += 4;
            }

            for (let j = 16; j < 64; j++) {
                w[j] = safe_add(Gamma1(w[j - 2]), safe_add(w[j - 7], safe_add(Gamma0(w[j - 15]), w[j - 16])));
            }

            let a = H[0];
            let b = H[1];
            let c = H[2];
            let d = H[3];
            let e = H[4];
            let f = H[5];
            let g = H[6];
            let h = H[7];

            for (let j = 0; j < 64; j++) {
                let T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1(e)), Ch(e, f, g)), K[j]), w[j]);
                let T2 = safe_add(Sigma0(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            H[0] = safe_add(H[0], a);
            H[1] = safe_add(H[1], b);
            H[2] = safe_add(H[2], c);
            H[3] = safe_add(H[3], d);
            H[4] = safe_add(H[4], e);
            H[5] = safe_add(H[5], f);
            H[6] = safe_add(H[6], g);
            H[7] = safe_add(H[7], h);
        }

        return H.map(function (x) {
            return (x >>> 28).toString(16) + ((x >>> 4) & 0x0FFFFFFF).toString(16);
        }).join('');
    }
}

function hashRoomState(roomState) {
    return sha256(JSON.stringify(roomState));
}

module.exports = {
    hashRoomState: hashRoomState
};
