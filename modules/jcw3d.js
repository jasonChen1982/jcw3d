(function() {

var root = this;

THREE.Color = function ( color ) {

if ( arguments.length === 3 ) {

    return this.setRGB( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ] );

}

return this.set( color )

};

THREE.Color.prototype = {

    constructor: THREE.Color,

    r: 1, g: 1, b: 1,

    set: function ( value ) {

        if ( value instanceof THREE.Color ) {

            this.copy( value );

        } else if ( typeof value === 'number' ) {

            this.setHex( value );

        } else if ( typeof value === 'string' ) {

            this.setStyle( value );

        }

        return this;

    },

    setHex: function ( hex ) {

        hex = Math.floor( hex );

        this.r = ( hex >> 16 & 255 ) / 255;
        this.g = ( hex >> 8 & 255 ) / 255;
        this.b = ( hex & 255 ) / 255;

        return this;

    },

    setRGB: function ( r, g, b ) {

        this.r = r;
        this.g = g;
        this.b = b;

        return this;

    },

    setHSL: function ( h, s, l ) {

        // h,s,l ranges are in 0.0 - 1.0

        if ( s === 0 ) {

            this.r = this.g = this.b = l;

        } else {

            var hue2rgb = function ( p, q, t ) {

                if ( t < 0 ) t += 1;
                if ( t > 1 ) t -= 1;
                if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
                if ( t < 1 / 2 ) return q;
                if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
                return p;

            };

            var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
            var q = ( 2 * l ) - p;

            this.r = hue2rgb( q, p, h + 1 / 3 );
            this.g = hue2rgb( q, p, h );
            this.b = hue2rgb( q, p, h - 1 / 3 );

        }

        return this;

    },

    setStyle: function ( style ) {

        // rgb(255,0,0)

        if ( /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test( style ) ) {

            var color = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec( style );

            this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
            this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
            this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

            return this;

        }

        // rgb(100%,0%,0%)

        if ( /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test( style ) ) {

            var color = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec( style );

            this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
            this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
            this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

            return this;

        }

        // #ff0000

        if ( /^\#([0-9a-f]{6})$/i.test( style ) ) {

            var color = /^\#([0-9a-f]{6})$/i.exec( style );

            this.setHex( parseInt( color[ 1 ], 16 ) );

            return this;

        }

        // #f00

        if ( /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test( style ) ) {

            var color = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec( style );

            this.setHex( parseInt( color[ 1 ] + color[ 1 ] + color[ 2 ] + color[ 2 ] + color[ 3 ] + color[ 3 ], 16 ) );

            return this;

        }

        // red

        if ( /^(\w+)$/i.test( style ) ) {

            this.setHex( THREE.ColorKeywords[ style ] );

            return this;

        }


    },

    copy: function ( color ) {

        this.r = color.r;
        this.g = color.g;
        this.b = color.b;

        return this;

    },

    copyGammaToLinear: function ( color ) {

        this.r = color.r * color.r;
        this.g = color.g * color.g;
        this.b = color.b * color.b;

        return this;

    },

    copyLinearToGamma: function ( color ) {

        this.r = Math.sqrt( color.r );
        this.g = Math.sqrt( color.g );
        this.b = Math.sqrt( color.b );

        return this;

    },

    convertGammaToLinear: function () {

        var r = this.r, g = this.g, b = this.b;

        this.r = r * r;
        this.g = g * g;
        this.b = b * b;

        return this;

    },

    convertLinearToGamma: function () {

        this.r = Math.sqrt( this.r );
        this.g = Math.sqrt( this.g );
        this.b = Math.sqrt( this.b );

        return this;

    },

    getHex: function () {

        return ( this.r * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.b * 255 ) << 0;

    },

    getHexString: function () {

        return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );

    },

    getHSL: function ( optionalTarget ) {

        // h,s,l ranges are in 0.0 - 1.0

        var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

        var r = this.r, g = this.g, b = this.b;

        var max = Math.max( r, g, b );
        var min = Math.min( r, g, b );

        var hue, saturation;
        var lightness = ( min + max ) / 2.0;

        if ( min === max ) {

            hue = 0;
            saturation = 0;

        } else {

            var delta = max - min;

            saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

            switch ( max ) {

                case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
                case g: hue = ( b - r ) / delta + 2; break;
                case b: hue = ( r - g ) / delta + 4; break;

            }

            hue /= 6;

        }

        hsl.h = hue;
        hsl.s = saturation;
        hsl.l = lightness;

        return hsl;

    },

    getStyle: function () {

        return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

    },

    offsetHSL: function ( h, s, l ) {

        var hsl = this.getHSL();

        hsl.h += h; hsl.s += s; hsl.l += l;

        this.setHSL( hsl.h, hsl.s, hsl.l );

        return this;

    },

    add: function ( color ) {

        this.r += color.r;
        this.g += color.g;
        this.b += color.b;

        return this;

    },

    addColors: function ( color1, color2 ) {

        this.r = color1.r + color2.r;
        this.g = color1.g + color2.g;
        this.b = color1.b + color2.b;

        return this;

    },

    addScalar: function ( s ) {

        this.r += s;
        this.g += s;
        this.b += s;

        return this;

    },

    multiply: function ( color ) {

        this.r *= color.r;
        this.g *= color.g;
        this.b *= color.b;

        return this;

    },

    multiplyScalar: function ( s ) {

        this.r *= s;
        this.g *= s;
        this.b *= s;

        return this;

    },

    lerp: function ( color, alpha ) {

        this.r += ( color.r - this.r ) * alpha;
        this.g += ( color.g - this.g ) * alpha;
        this.b += ( color.b - this.b ) * alpha;

        return this;

    },

    equals: function ( c ) {

        return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

    },

    fromArray: function ( array ) {

        this.r = array[ 0 ];
        this.g = array[ 1 ];
        this.b = array[ 2 ];

        return this;

    },

    toArray: function () {

        return [ this.r, this.g, this.b ];

    },

    clone: function () {

        return new THREE.Color().setRGB( this.r, this.g, this.b );

    }

};

THREE.Quaternion = function ( x, y, z, w ) {

    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._w = ( w !== undefined ) ? w : 1;

};

THREE.Quaternion.prototype = {

    constructor: THREE.Quaternion,

    _x: 0,_y: 0, _z: 0, _w: 0,

    _euler: undefined,

    _updateEuler: function ( callback ) {

        if ( this._euler !== undefined ) {

            this._euler.setFromQuaternion( this, undefined, false );

        }

    },

    get x () {

        return this._x;

    },

    set x ( value ) {

        this._x = value;
        this._updateEuler();

    },

    get y () {

        return this._y;

    },

    set y ( value ) {

        this._y = value;
        this._updateEuler();

    },

    get z () {

        return this._z;

    },

    set z ( value ) {

        this._z = value;
        this._updateEuler();

    },

    get w () {

        return this._w;

    },

    set w ( value ) {

        this._w = value;
        this._updateEuler();

    },

    set: function ( x, y, z, w ) {

        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;

        this._updateEuler();

        return this;

    },

    copy: function ( quaternion ) {

        this._x = quaternion._x;
        this._y = quaternion._y;
        this._z = quaternion._z;
        this._w = quaternion._w;

        this._updateEuler();

        return this;

    },

    setFromEuler: function ( euler, update ) {

        if ( euler instanceof THREE.Euler === false ) {

            throw new Error( 'ERROR: Quaternion\'s .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.' );
        }

        // http://www.mathworks.com/matlabcentral/fileexchange/
        //  20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //  content/SpinCalc.m

        var c1 = Math.cos( euler._x / 2 );
        var c2 = Math.cos( euler._y / 2 );
        var c3 = Math.cos( euler._z / 2 );
        var s1 = Math.sin( euler._x / 2 );
        var s2 = Math.sin( euler._y / 2 );
        var s3 = Math.sin( euler._z / 2 );

        if ( euler.order === 'XYZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( euler.order === 'YXZ' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if ( euler.order === 'ZXY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( euler.order === 'ZYX' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        } else if ( euler.order === 'YZX' ) {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;

        } else if ( euler.order === 'XZY' ) {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;

        }

        if ( update !== false ) this._updateEuler();

        return this;

    },

    setFromAxisAngle: function ( axis, angle ) {

        // from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        // axis have to be normalized

        var halfAngle = angle / 2, s = Math.sin( halfAngle );

        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos( halfAngle );

        this._updateEuler();

        return this;

    },

    setFromRotationMatrix: function ( m ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var te = m.elements,

            m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10],

            trace = m11 + m22 + m33,
            s;

        if ( trace > 0 ) {

            s = 0.5 / Math.sqrt( trace + 1.0 );

            this._w = 0.25 / s;
            this._x = ( m32 - m23 ) * s;
            this._y = ( m13 - m31 ) * s;
            this._z = ( m21 - m12 ) * s;

        } else if ( m11 > m22 && m11 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

            this._w = (m32 - m23 ) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21 ) / s;
            this._z = (m13 + m31 ) / s;

        } else if ( m22 > m33 ) {

            s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

            this._w = (m13 - m31 ) / s;
            this._x = (m12 + m21 ) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32 ) / s;

        } else {

            s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

            this._w = ( m21 - m12 ) / s;
            this._x = ( m13 + m31 ) / s;
            this._y = ( m23 + m32 ) / s;
            this._z = 0.25 * s;

        }

        this._updateEuler();

        return this;

    },

    inverse: function () {

        this.conjugate().normalize();

        return this;

    },

    conjugate: function () {

        this._x *= -1;
        this._y *= -1;
        this._z *= -1;

        this._updateEuler();

        return this;

    },

    lengthSq: function () {

        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

    },

    length: function () {

        return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

    },

    normalize: function () {

        var l = this.length();

        if ( l === 0 ) {

            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;

        } else {

            l = 1 / l;

            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;

        }

        return this;

    },

    multiply: function ( q, p ) {

        if ( p !== undefined ) {

            console.warn( 'DEPRECATED: Quaternion\'s .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
            return this.multiplyQuaternions( q, p );

        }

        return this.multiplyQuaternions( this, q );

    },

    multiplyQuaternions: function ( a, b ) {

        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

        var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
        var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        this._updateEuler();

        return this;

    },

    multiplyVector3: function ( vector ) {

        console.warn( 'DEPRECATED: Quaternion\'s .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
        return vector.applyQuaternion( this );

    },

    slerp: function ( qb, t ) {

        var x = this._x, y = this._y, z = this._z, w = this._w;

        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

        var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        if ( cosHalfTheta < 0 ) {

            this._w = -qb._w;
            this._x = -qb._x;
            this._y = -qb._y;
            this._z = -qb._z;

            cosHalfTheta = -cosHalfTheta;

        } else {

            this.copy( qb );

        }

        if ( cosHalfTheta >= 1.0 ) {

            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;

            return this;

        }

        var halfTheta = Math.acos( cosHalfTheta );
        var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

        if ( Math.abs( sinHalfTheta ) < 0.001 ) {

            this._w = 0.5 * ( w + this._w );
            this._x = 0.5 * ( x + this._x );
            this._y = 0.5 * ( y + this._y );
            this._z = 0.5 * ( z + this._z );

            return this;

        }

        var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
        ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

        this._w = ( w * ratioA + this._w * ratioB );
        this._x = ( x * ratioA + this._x * ratioB );
        this._y = ( y * ratioA + this._y * ratioB );
        this._z = ( z * ratioA + this._z * ratioB );

        this._updateEuler();

        return this;

    },

    equals: function ( quaternion ) {

        return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

    },

    fromArray: function ( array ) {

        this._x = array[ 0 ];
        this._y = array[ 1 ];
        this._z = array[ 2 ];
        this._w = array[ 3 ];

        this._updateEuler();

        return this;

    },

    toArray: function () {

        return [ this._x, this._y, this._z, this._w ];

    },

    clone: function () {

        return new THREE.Quaternion( this._x, this._y, this._z, this._w );

    }

};

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

    return qm.copy( qa ).slerp( qb, t );

}

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

    this.x = x || 0;
    this.y = y || 0;

};

THREE.Vector2.prototype = {

    constructor: THREE.Vector2,

    set: function ( x, y ) {

        this.x = x;
        this.y = y;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },


    setComponent: function ( index, value ) {

        switch ( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            default: throw new Error( "index is out of range: " + index );

        }

    },

    getComponent: function ( index ) {

        switch ( index ) {

            case 0: return this.x;
            case 1: return this.y;
            default: throw new Error( "index is out of range: " + index );

        }

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;

        return this;

    },

    add: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector2\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );

        }

        this.x += v.x;
        this.y += v.y;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;

        return this;

    },

    sub: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector2\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );

        }

        this.x -= v.x;
        this.y -= v.y;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;

    },

    multiplyScalar: function ( s ) {

        this.x *= s;
        this.y *= s;

        return this;

    },

    divideScalar: function ( scalar ) {

        if ( scalar !== 0 ) {

            var invScalar = 1 / scalar;

            this.x *= invScalar;
            this.y *= invScalar;

        } else {

            this.x = 0;
            this.y = 0;

        }

        return this;

    },

    min: function ( v ) {

        if ( this.x > v.x ) {

            this.x = v.x;

        }

        if ( this.y > v.y ) {

            this.y = v.y;

        }

        return this;

    },

    max: function ( v ) {

        if ( this.x < v.x ) {

            this.x = v.x;

        }

        if ( this.y < v.y ) {

            this.y = v.y;

        }

        return this;

    },

    clamp: function ( min, max ) {

        // This function assumes min < max, if this assumption isn't true it will not operate correctly

        if ( this.x < min.x ) {

            this.x = min.x;

        } else if ( this.x > max.x ) {

            this.x = max.x;

        }

        if ( this.y < min.y ) {

            this.y = min.y;

        } else if ( this.y > max.y ) {

            this.y = max.y;

        }

        return this;
    },

    clampScalar: ( function () {

        var min, max;

        return function ( minVal, maxVal ) {

            if ( min === undefined ) {

                min = new THREE.Vector2();
                max = new THREE.Vector2();

            }

            min.set( minVal, minVal );
            max.set( maxVal, maxVal );

            return this.clamp( min, max );

        };
        
    } )(),

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

        return this;

    },

    negate: function () {

        return this.multiplyScalar( - 1 );

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    distanceTo: function ( v ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    },

    distanceToSquared: function ( v ) {

        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;

    },

    setLength: function ( l ) {

        var oldLength = this.length();

        if ( oldLength !== 0 && l !== oldLength ) {

            this.multiplyScalar( l / oldLength );
        }

        return this;

    },

    lerp: function ( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;

        return this;

    },

    equals: function( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) );

    },

    fromArray: function ( array ) {

        this.x = array[ 0 ];
        this.y = array[ 1 ];

        return this;

    },

    toArray: function () {

        return [ this.x, this.y ];

    },

    clone: function () {

        return new THREE.Vector2( this.x, this.y );

    }

};

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector3 = function ( x, y, z ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

};

THREE.Vector3.prototype = {

    constructor: THREE.Vector3,

    set: function ( x, y, z ) {

        this.x = x;
        this.y = y;
        this.z = z;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },

    setZ: function ( z ) {

        this.z = z;

        return this;

    },

    setComponent: function ( index, value ) {

        switch ( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            case 2: this.z = value; break;
            default: throw new Error( "index is out of range: " + index );

        }

    },

    getComponent: function ( index ) {

        switch ( index ) {

            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            default: throw new Error( "index is out of range: " + index );

        }

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;

        return this;

    },

    add: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector3\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );

        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;
        this.z += s;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;

    },

    sub: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector3\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );

        }

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;

    },

    multiply: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector3\'s .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
            return this.multiplyVectors( v, w );

        }

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;

        return this;

    },

    multiplyScalar: function ( scalar ) {

        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;

    },

    multiplyVectors: function ( a, b ) {

        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;

        return this;

    },

    applyEuler: function () {

        var quaternion;

        return function ( euler ) {

            if ( euler instanceof THREE.Euler === false ) {

                console.error( 'ERROR: Vector3\'s .applyEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.' );

            }

            if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

            this.applyQuaternion( quaternion.setFromEuler( euler ) );

            return this;

        };

    }(),

    applyAxisAngle: function () {

        var quaternion;

        return function ( axis, angle ) {

            if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

            this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

            return this;

        };

    }(),

    applyMatrix3: function ( m ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        var e = m.elements;

        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;

        return this;

    },

    applyMatrix4: function ( m ) {

        // input: THREE.Matrix4 affine matrix

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;

        this.x = e[0] * x + e[4] * y + e[8]  * z + e[12];
        this.y = e[1] * x + e[5] * y + e[9]  * z + e[13];
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14];

        return this;

    },

    applyProjection: function ( m ) {

        // input: THREE.Matrix4 projection matrix

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;
        var d = 1 / ( e[3] * x + e[7] * y + e[11] * z + e[15] ); // perspective divide

        this.x = ( e[0] * x + e[4] * y + e[8]  * z + e[12] ) * d;
        this.y = ( e[1] * x + e[5] * y + e[9]  * z + e[13] ) * d;
        this.z = ( e[2] * x + e[6] * y + e[10] * z + e[14] ) * d;

        return this;

    },

    applyQuaternion: function ( q ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;

        var qx = q.x;
        var qy = q.y;
        var qz = q.z;
        var qw = q.w;

        // calculate quat * vector

        var ix =  qw * x + qy * z - qz * y;
        var iy =  qw * y + qz * x - qx * z;
        var iz =  qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;

    },

    transformDirection: function ( m ) {

        // input: THREE.Matrix4 affine matrix
        // vector interpreted as a direction

        var x = this.x, y = this.y, z = this.z;

        var e = m.elements;

        this.x = e[0] * x + e[4] * y + e[8]  * z;
        this.y = e[1] * x + e[5] * y + e[9]  * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;

        this.normalize();

        return this;

    },

    divide: function ( v ) {

        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;

        return this;

    },

    divideScalar: function ( scalar ) {

        if ( scalar !== 0 ) {

            var invScalar = 1 / scalar;

            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;

        } else {

            this.x = 0;
            this.y = 0;
            this.z = 0;

        }

        return this;

    },

    min: function ( v ) {

        if ( this.x > v.x ) {

            this.x = v.x;

        }

        if ( this.y > v.y ) {

            this.y = v.y;

        }

        if ( this.z > v.z ) {

            this.z = v.z;

        }

        return this;

    },

    max: function ( v ) {

        if ( this.x < v.x ) {

            this.x = v.x;

        }

        if ( this.y < v.y ) {

            this.y = v.y;

        }

        if ( this.z < v.z ) {

            this.z = v.z;

        }

        return this;

    },

    clamp: function ( min, max ) {

        // This function assumes min < max, if this assumption isn't true it will not operate correctly

        if ( this.x < min.x ) {

            this.x = min.x;

        } else if ( this.x > max.x ) {

            this.x = max.x;

        }

        if ( this.y < min.y ) {

            this.y = min.y;

        } else if ( this.y > max.y ) {

            this.y = max.y;

        }

        if ( this.z < min.z ) {

            this.z = min.z;

        } else if ( this.z > max.z ) {

            this.z = max.z;

        }

        return this;

    },

    clampScalar: ( function () {

        var min, max;

        return function ( minVal, maxVal ) {

            if ( min === undefined ) {

                min = new THREE.Vector3();
                max = new THREE.Vector3();

            }

            min.set( minVal, minVal, minVal );
            max.set( maxVal, maxVal, maxVal );

            return this.clamp( min, max );

        };

    } )(),

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
        this.z = Math.floor( this.z );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );
        this.z = Math.ceil( this.z );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );
        this.z = Math.round( this.z );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
        this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

        return this;

    },

    negate: function () {

        return this.multiplyScalar( - 1 );

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

    },

    lengthManhattan: function () {

        return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    setLength: function ( l ) {

        var oldLength = this.length();

        if ( oldLength !== 0 && l !== oldLength  ) {

            this.multiplyScalar( l / oldLength );
        }

        return this;

    },

    lerp: function ( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        this.z += ( v.z - this.z ) * alpha;

        return this;

    },

    cross: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector3\'s .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
            return this.crossVectors( v, w );

        }

        var x = this.x, y = this.y, z = this.z;

        this.x = y * v.z - z * v.y;
        this.y = z * v.x - x * v.z;
        this.z = x * v.y - y * v.x;

        return this;

    },

    crossVectors: function ( a, b ) {

        var ax = a.x, ay = a.y, az = a.z;
        var bx = b.x, by = b.y, bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;

    },

    projectOnVector: function () {

        var v1, dot;

        return function ( vector ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            v1.copy( vector ).normalize();

            dot = this.dot( v1 );

            return this.copy( v1 ).multiplyScalar( dot );

        };

    }(),

    projectOnPlane: function () {

        var v1;

        return function ( planeNormal ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            v1.copy( this ).projectOnVector( planeNormal );

            return this.sub( v1 );

        }

    }(),

    reflect: function () {

        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length

        var v1;

        return function ( normal ) {

            if ( v1 === undefined ) v1 = new THREE.Vector3();

            return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

        }

    }(),

    angleTo: function ( v ) {

        var theta = this.dot( v ) / ( this.length() * v.length() );

        // clamp, to handle numerical problems

        return Math.acos( THREE.Math.clamp( theta, -1, 1 ) );

    },

    distanceTo: function ( v ) {

        return Math.sqrt( this.distanceToSquared( v ) );

    },

    distanceToSquared: function ( v ) {

        var dx = this.x - v.x;
        var dy = this.y - v.y;
        var dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;

    },

    setEulerFromRotationMatrix: function ( m, order ) {

        console.error( "REMOVED: Vector3\'s setEulerFromRotationMatrix has been removed in favor of Euler.setFromRotationMatrix(), please update your code.");

    },

    setEulerFromQuaternion: function ( q, order ) {

        console.error( "REMOVED: Vector3\'s setEulerFromQuaternion: has been removed in favor of Euler.setFromQuaternion(), please update your code.");

    },

    getPositionFromMatrix: function ( m ) {

        console.warn( "DEPRECATED: Vector3\'s .getPositionFromMatrix() has been renamed to .setFromMatrixPosition(). Please update your code." );

        return this.setFromMatrixPosition( m );

    },

    getScaleFromMatrix: function ( m ) {

        console.warn( "DEPRECATED: Vector3\'s .getScaleFromMatrix() has been renamed to .setFromMatrixScale(). Please update your code." );

        return this.setFromMatrixScale( m );
    },

    getColumnFromMatrix: function ( index, matrix ) {

        console.warn( "DEPRECATED: Vector3\'s .getColumnFromMatrix() has been renamed to .setFromMatrixColumn(). Please update your code." );

        return this.setFromMatrixColumn( index, matrix );

    },

    setFromMatrixPosition: function ( m ) {

        this.x = m.elements[ 12 ];
        this.y = m.elements[ 13 ];
        this.z = m.elements[ 14 ];

        return this;

    },

    setFromMatrixScale: function ( m ) {

        var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[  2 ] ).length();
        var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[  6 ] ).length();
        var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

        this.x = sx;
        this.y = sy;
        this.z = sz;

        return this;
    },

    setFromMatrixColumn: function ( index, matrix ) {

        var offset = index * 4;

        var me = matrix.elements;

        this.x = me[ offset ];
        this.y = me[ offset + 1 ];
        this.z = me[ offset + 2 ];

        return this;

    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

    },

    fromArray: function ( array ) {

        this.x = array[ 0 ];
        this.y = array[ 1 ];
        this.z = array[ 2 ];

        return this;

    },

    toArray: function () {

        return [ this.x, this.y, this.z ];

    },

    clone: function () {

        return new THREE.Vector3( this.x, this.y, this.z );

    }

};
/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector4 = function ( x, y, z, w ) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

    constructor: THREE.Vector4,

    set: function ( x, y, z, w ) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;

        return this;

    },

    setX: function ( x ) {

        this.x = x;

        return this;

    },

    setY: function ( y ) {

        this.y = y;

        return this;

    },

    setZ: function ( z ) {

        this.z = z;

        return this;

    },

    setW: function ( w ) {

        this.w = w;

        return this;

    },

    setComponent: function ( index, value ) {

        switch ( index ) {

            case 0: this.x = value; break;
            case 1: this.y = value; break;
            case 2: this.z = value; break;
            case 3: this.w = value; break;
            default: throw new Error( "index is out of range: " + index );

        }

    },

    getComponent: function ( index ) {

        switch ( index ) {

            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
            case 3: return this.w;
            default: throw new Error( "index is out of range: " + index );

        }

    },

    copy: function ( v ) {

        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = ( v.w !== undefined ) ? v.w : 1;

        return this;

    },

    add: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector4\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
            return this.addVectors( v, w );

        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;

        return this;

    },

    addScalar: function ( s ) {

        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;

        return this;

    },

    addVectors: function ( a, b ) {

        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;

        return this;

    },

    sub: function ( v, w ) {

        if ( w !== undefined ) {

            console.warn( 'DEPRECATED: Vector4\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
            return this.subVectors( v, w );

        }

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;

        return this;

    },

    subVectors: function ( a, b ) {

        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;

        return this;

    },

    multiplyScalar: function ( scalar ) {

        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;

        return this;

    },

    applyMatrix4: function ( m ) {

        var x = this.x;
        var y = this.y;
        var z = this.z;
        var w = this.w;

        var e = m.elements;

        this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
        this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

        return this;

    },

    divideScalar: function ( scalar ) {

        if ( scalar !== 0 ) {

            var invScalar = 1 / scalar;

            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
            this.w *= invScalar;

        } else {

            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;

        }

        return this;

    },

    setAxisAngleFromQuaternion: function ( q ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

        // q is assumed to be normalized

        this.w = 2 * Math.acos( q.w );

        var s = Math.sqrt( 1 - q.w * q.w );

        if ( s < 0.0001 ) {

             this.x = 1;
             this.y = 0;
             this.z = 0;

        } else {

             this.x = q.x / s;
             this.y = q.y / s;
             this.z = q.z / s;

        }

        return this;

    },

    setAxisAngleFromRotationMatrix: function ( m ) {

        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        var angle, x, y, z,     // variables for result
            epsilon = 0.01,     // margin to allow for rounding errors
            epsilon2 = 0.1,     // margin to distinguish between 0 and 180 degrees

            te = m.elements,

            m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10];

        if ( ( Math.abs( m12 - m21 ) < epsilon )
          && ( Math.abs( m13 - m31 ) < epsilon )
          && ( Math.abs( m23 - m32 ) < epsilon ) ) {

            // singularity found
            // first check for identity matrix which must have +1 for all terms
            // in leading diagonal and zero in other terms

            if ( ( Math.abs( m12 + m21 ) < epsilon2 )
              && ( Math.abs( m13 + m31 ) < epsilon2 )
              && ( Math.abs( m23 + m32 ) < epsilon2 )
              && ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

                // this singularity is identity matrix so angle = 0

                this.set( 1, 0, 0, 0 );

                return this; // zero angle, arbitrary axis

            }

            // otherwise this singularity is angle = 180

            angle = Math.PI;

            var xx = ( m11 + 1 ) / 2;
            var yy = ( m22 + 1 ) / 2;
            var zz = ( m33 + 1 ) / 2;
            var xy = ( m12 + m21 ) / 4;
            var xz = ( m13 + m31 ) / 4;
            var yz = ( m23 + m32 ) / 4;

            if ( ( xx > yy ) && ( xx > zz ) ) { // m11 is the largest diagonal term

                if ( xx < epsilon ) {

                    x = 0;
                    y = 0.707106781;
                    z = 0.707106781;

                } else {

                    x = Math.sqrt( xx );
                    y = xy / x;
                    z = xz / x;

                }

            } else if ( yy > zz ) { // m22 is the largest diagonal term

                if ( yy < epsilon ) {

                    x = 0.707106781;
                    y = 0;
                    z = 0.707106781;

                } else {

                    y = Math.sqrt( yy );
                    x = xy / y;
                    z = yz / y;

                }

            } else { // m33 is the largest diagonal term so base result on this

                if ( zz < epsilon ) {

                    x = 0.707106781;
                    y = 0.707106781;
                    z = 0;

                } else {

                    z = Math.sqrt( zz );
                    x = xz / z;
                    y = yz / z;

                }

            }

            this.set( x, y, z, angle );

            return this; // return 180 deg rotation

        }

        // as we have reached here there are no singularities so we can handle normally

        var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 )
                         + ( m13 - m31 ) * ( m13 - m31 )
                         + ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

        if ( Math.abs( s ) < 0.001 ) s = 1;

        // prevent divide by zero, should not happen if matrix is orthogonal and should be
        // caught by singularity test above, but I've left it in just in case

        this.x = ( m32 - m23 ) / s;
        this.y = ( m13 - m31 ) / s;
        this.z = ( m21 - m12 ) / s;
        this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

        return this;

    },

    min: function ( v ) {

        if ( this.x > v.x ) {

            this.x = v.x;

        }

        if ( this.y > v.y ) {

            this.y = v.y;

        }

        if ( this.z > v.z ) {

            this.z = v.z;

        }

        if ( this.w > v.w ) {

            this.w = v.w;

        }

        return this;

    },

    max: function ( v ) {

        if ( this.x < v.x ) {

            this.x = v.x;

        }

        if ( this.y < v.y ) {

            this.y = v.y;

        }

        if ( this.z < v.z ) {

            this.z = v.z;

        }

        if ( this.w < v.w ) {

            this.w = v.w;

        }

        return this;

    },

    clamp: function ( min, max ) {

        // This function assumes min < max, if this assumption isn't true it will not operate correctly

        if ( this.x < min.x ) {

            this.x = min.x;

        } else if ( this.x > max.x ) {

            this.x = max.x;

        }

        if ( this.y < min.y ) {

            this.y = min.y;

        } else if ( this.y > max.y ) {

            this.y = max.y;

        }

        if ( this.z < min.z ) {

            this.z = min.z;

        } else if ( this.z > max.z ) {

            this.z = max.z;

        }

        if ( this.w < min.w ) {

            this.w = min.w;

        } else if ( this.w > max.w ) {

            this.w = max.w;

        }

        return this;

    },

    clampScalar: ( function () {

        var min, max;

        return function ( minVal, maxVal ) {

            if ( min === undefined ) {

                min = new THREE.Vector4();
                max = new THREE.Vector4();

            }

            min.set( minVal, minVal, minVal, minVal );
            max.set( maxVal, maxVal, maxVal, maxVal );

            return this.clamp( min, max );

        };

    } )(),

    floor: function () {

        this.x = Math.floor( this.x );
        this.y = Math.floor( this.y );
        this.z = Math.floor( this.z );
        this.w = Math.floor( this.w );

        return this;

    },

    ceil: function () {

        this.x = Math.ceil( this.x );
        this.y = Math.ceil( this.y );
        this.z = Math.ceil( this.z );
        this.w = Math.ceil( this.w );

        return this;

    },

    round: function () {

        this.x = Math.round( this.x );
        this.y = Math.round( this.y );
        this.z = Math.round( this.z );
        this.w = Math.round( this.w );

        return this;

    },

    roundToZero: function () {

        this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
        this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
        this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
        this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

        return this;

    },

    negate: function () {

        return this.multiplyScalar( -1 );

    },

    dot: function ( v ) {

        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

    },

    lengthSq: function () {

        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

    },

    length: function () {

        return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

    },

    lengthManhattan: function () {

        return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

    },

    normalize: function () {

        return this.divideScalar( this.length() );

    },

    setLength: function ( l ) {

        var oldLength = this.length();

        if ( oldLength !== 0 && l !== oldLength ) {

            this.multiplyScalar( l / oldLength );

        }

        return this;

    },

    lerp: function ( v, alpha ) {

        this.x += ( v.x - this.x ) * alpha;
        this.y += ( v.y - this.y ) * alpha;
        this.z += ( v.z - this.z ) * alpha;
        this.w += ( v.w - this.w ) * alpha;

        return this;

    },

    equals: function ( v ) {

        return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

    },

    fromArray: function ( array ) {

        this.x = array[ 0 ];
        this.y = array[ 1 ];
        this.z = array[ 2 ];
        this.w = array[ 3 ];

        return this;

    },

    toArray: function () {

        return [ this.x, this.y, this.z, this.w ];

    },

    clone: function () {

        return new THREE.Vector4( this.x, this.y, this.z, this.w );

    }

};

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Euler = function ( x, y, z, order ) {

    this._x = x || 0;
    this._y = y || 0;
    this._z = z || 0;
    this._order = order || THREE.Euler.DefaultOrder;

};

THREE.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREE.Euler.DefaultOrder = 'XYZ';

THREE.Euler.prototype = {

    constructor: THREE.Euler,

    _x: 0, _y: 0, _z: 0, _order: THREE.Euler.DefaultOrder,

    _quaternion: undefined,

    _updateQuaternion: function () {

        if ( this._quaternion !== undefined ) {

            this._quaternion.setFromEuler( this, false );

        }

    },

    get x () {

        return this._x;

    },

    set x ( value ) {

        this._x = value;
        this._updateQuaternion();

    },

    get y () {

        return this._y;

    },

    set y ( value ) {

        this._y = value;
        this._updateQuaternion();

    },

    get z () {

        return this._z;

    },

    set z ( value ) {

        this._z = value;
        this._updateQuaternion();

    },

    get order () {

        return this._order;

    },

    set order ( value ) {

        this._order = value;
        this._updateQuaternion();

    },

    set: function ( x, y, z, order ) {

        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order || this._order;

        this._updateQuaternion();

        return this;

    },

    copy: function ( euler ) {

        this._x = euler._x;
        this._y = euler._y;
        this._z = euler._z;
        this._order = euler._order;

        this._updateQuaternion();

        return this;

    },

    setFromRotationMatrix: function ( m, order ) {

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        // clamp, to handle numerical problems

        function clamp( x ) {

            return Math.min( Math.max( x, -1 ), 1 );

        }

        var te = m.elements;
        var m11 = te[0], m12 = te[4], m13 = te[8];
        var m21 = te[1], m22 = te[5], m23 = te[9];
        var m31 = te[2], m32 = te[6], m33 = te[10];

        order = order || this._order;

        if ( order === 'XYZ' ) {

            this._y = Math.asin( clamp( m13 ) );

            if ( Math.abs( m13 ) < 0.99999 ) {

                this._x = Math.atan2( - m23, m33 );
                this._z = Math.atan2( - m12, m11 );

            } else {

                this._x = Math.atan2( m32, m22 );
                this._z = 0;

            }

        } else if ( order === 'YXZ' ) {

            this._x = Math.asin( - clamp( m23 ) );

            if ( Math.abs( m23 ) < 0.99999 ) {

                this._y = Math.atan2( m13, m33 );
                this._z = Math.atan2( m21, m22 );

            } else {

                this._y = Math.atan2( - m31, m11 );
                this._z = 0;

            }

        } else if ( order === 'ZXY' ) {

            this._x = Math.asin( clamp( m32 ) );

            if ( Math.abs( m32 ) < 0.99999 ) {

                this._y = Math.atan2( - m31, m33 );
                this._z = Math.atan2( - m12, m22 );

            } else {

                this._y = 0;
                this._z = Math.atan2( m21, m11 );

            }

        } else if ( order === 'ZYX' ) {

            this._y = Math.asin( - clamp( m31 ) );

            if ( Math.abs( m31 ) < 0.99999 ) {

                this._x = Math.atan2( m32, m33 );
                this._z = Math.atan2( m21, m11 );

            } else {

                this._x = 0;
                this._z = Math.atan2( - m12, m22 );

            }

        } else if ( order === 'YZX' ) {

            this._z = Math.asin( clamp( m21 ) );

            if ( Math.abs( m21 ) < 0.99999 ) {

                this._x = Math.atan2( - m23, m22 );
                this._y = Math.atan2( - m31, m11 );

            } else {

                this._x = 0;
                this._y = Math.atan2( m13, m33 );

            }

        } else if ( order === 'XZY' ) {

            this._z = Math.asin( - clamp( m12 ) );

            if ( Math.abs( m12 ) < 0.99999 ) {

                this._x = Math.atan2( m32, m22 );
                this._y = Math.atan2( m13, m11 );

            } else {

                this._x = Math.atan2( - m23, m33 );
                this._y = 0;

            }

        } else {

            console.warn( 'WARNING: Euler.setFromRotationMatrix() given unsupported order: ' + order )

        }

        this._order = order;

        this._updateQuaternion();

        return this;

    },

    setFromQuaternion: function ( q, order, update ) {

        // q is assumed to be normalized

        // clamp, to handle numerical problems

        function clamp( x ) {

            return Math.min( Math.max( x, -1 ), 1 );

        }

        // http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m

        var sqx = q.x * q.x;
        var sqy = q.y * q.y;
        var sqz = q.z * q.z;
        var sqw = q.w * q.w;

        order = order || this._order;

        if ( order === 'XYZ' ) {

            this._x = Math.atan2( 2 * ( q.x * q.w - q.y * q.z ), ( sqw - sqx - sqy + sqz ) );
            this._y = Math.asin(  clamp( 2 * ( q.x * q.z + q.y * q.w ) ) );
            this._z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw + sqx - sqy - sqz ) );

        } else if ( order ===  'YXZ' ) {

            this._x = Math.asin(  clamp( 2 * ( q.x * q.w - q.y * q.z ) ) );
            this._y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw - sqx - sqy + sqz ) );
            this._z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw - sqx + sqy - sqz ) );

        } else if ( order === 'ZXY' ) {

            this._x = Math.asin(  clamp( 2 * ( q.x * q.w + q.y * q.z ) ) );
            this._y = Math.atan2( 2 * ( q.y * q.w - q.z * q.x ), ( sqw - sqx - sqy + sqz ) );
            this._z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( sqw - sqx + sqy - sqz ) );

        } else if ( order === 'ZYX' ) {

            this._x = Math.atan2( 2 * ( q.x * q.w + q.z * q.y ), ( sqw - sqx - sqy + sqz ) );
            this._y = Math.asin(  clamp( 2 * ( q.y * q.w - q.x * q.z ) ) );
            this._z = Math.atan2( 2 * ( q.x * q.y + q.z * q.w ), ( sqw + sqx - sqy - sqz ) );

        } else if ( order === 'YZX' ) {

            this._x = Math.atan2( 2 * ( q.x * q.w - q.z * q.y ), ( sqw - sqx + sqy - sqz ) );
            this._y = Math.atan2( 2 * ( q.y * q.w - q.x * q.z ), ( sqw + sqx - sqy - sqz ) );
            this._z = Math.asin(  clamp( 2 * ( q.x * q.y + q.z * q.w ) ) );

        } else if ( order === 'XZY' ) {

            this._x = Math.atan2( 2 * ( q.x * q.w + q.y * q.z ), ( sqw - sqx + sqy - sqz ) );
            this._y = Math.atan2( 2 * ( q.x * q.z + q.y * q.w ), ( sqw + sqx - sqy - sqz ) );
            this._z = Math.asin(  clamp( 2 * ( q.z * q.w - q.x * q.y ) ) );

        } else {

            console.warn( 'WARNING: Euler.setFromQuaternion() given unsupported order: ' + order )

        }

        this._order = order;

        if ( update !== false ) this._updateQuaternion();

        return this;

    },

    reorder: function () {

        // WARNING: this discards revolution information -bhouston

        var q = new THREE.Quaternion();

        return function ( newOrder ) {

            q.setFromEuler( this );
            this.setFromQuaternion( q, newOrder );

        };


    }(),

    fromArray: function ( array ) {

        this._x = array[ 0 ];
        this._y = array[ 1 ];
        this._z = array[ 2 ];
        if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

        this._updateQuaternion();

        return this;

    },

    toArray: function () {

        return [ this._x, this._y, this._z, this._order ];

    },

    equals: function ( euler ) {

        return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

    },

    clone: function () {

        return new THREE.Euler( this._x, this._y, this._z, this._order );

    }

};

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Line3 = function ( start, end ) {

    this.start = ( start !== undefined ) ? start : new THREE.Vector3();
    this.end = ( end !== undefined ) ? end : new THREE.Vector3();

};

THREE.Line3.prototype = {

    constructor: THREE.Line3,

    set: function ( start, end ) {

        this.start.copy( start );
        this.end.copy( end );

        return this;

    },

    copy: function ( line ) {

        this.start.copy( line.start );
        this.end.copy( line.end );

        return this;

    },

    center: function ( optionalTarget ) {

        var result = optionalTarget || new THREE.Vector3();
        return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

    },

    delta: function ( optionalTarget ) {

        var result = optionalTarget || new THREE.Vector3();
        return result.subVectors( this.end, this.start );

    },

    distanceSq: function () {

        return this.start.distanceToSquared( this.end );

    },

    distance: function () {

        return this.start.distanceTo( this.end );

    },

    at: function ( t, optionalTarget ) {

        var result = optionalTarget || new THREE.Vector3();

        return this.delta( result ).multiplyScalar( t ).add( this.start );

    },

    closestPointToPointParameter: function() {

        var startP = new THREE.Vector3();
        var startEnd = new THREE.Vector3();

        return function ( point, clampToLine ) {

            startP.subVectors( point, this.start );
            startEnd.subVectors( this.end, this.start );

            var startEnd2 = startEnd.dot( startEnd );
            var startEnd_startP = startEnd.dot( startP );

            var t = startEnd_startP / startEnd2;

            if ( clampToLine ) {

                t = THREE.Math.clamp( t, 0, 1 );

            }

            return t;

        };

    }(),

    closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

        var t = this.closestPointToPointParameter( point, clampToLine );

        var result = optionalTarget || new THREE.Vector3();

        return this.delta( result ).multiplyScalar( t ).add( this.start );

    },

    applyMatrix4: function ( matrix ) {

        this.start.applyMatrix4( matrix );
        this.end.applyMatrix4( matrix );

        return this;

    },

    equals: function ( line ) {

        return line.start.equals( this.start ) && line.end.equals( this.end );

    },

    clone: function () {

        return new THREE.Line3().copy( this );

    }

};

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Box2 = function ( min, max ) {

    this.min = ( min !== undefined ) ? min : new THREE.Vector2( Infinity, Infinity );
    this.max = ( max !== undefined ) ? max : new THREE.Vector2( -Infinity, -Infinity );

};

THREE.Box2.prototype = {

    constructor: THREE.Box2,

    set: function ( min, max ) {

        this.min.copy( min );
        this.max.copy( max );

        return this;

    },

    setFromPoints: function ( points ) {

        if ( points.length > 0 ) {

            var point = points[ 0 ];

            this.min.copy( point );
            this.max.copy( point );

            for ( var i = 1, il = points.length; i < il; i ++ ) {

                point = points[ i ];

                if ( point.x < this.min.x ) {

                    this.min.x = point.x;

                } else if ( point.x > this.max.x ) {

                    this.max.x = point.x;

                }

                if ( point.y < this.min.y ) {

                    this.min.y = point.y;

                } else if ( point.y > this.max.y ) {

                    this.max.y = point.y;

                }

            }

        } else {

            this.makeEmpty();

        }

        return this;

    },

    setFromCenterAndSize: function () {

        var v1 = new THREE.Vector2();

        return function ( center, size ) {

            var halfSize = v1.copy( size ).multiplyScalar( 0.5 );
            this.min.copy( center ).sub( halfSize );
            this.max.copy( center ).add( halfSize );

            return this;

        };

    }(),

    copy: function ( box ) {

        this.min.copy( box.min );
        this.max.copy( box.max );

        return this;

    },

    makeEmpty: function () {

        this.min.x = this.min.y = Infinity;
        this.max.x = this.max.y = -Infinity;

        return this;

    },

    empty: function () {

        // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

        return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );

    },

    center: function ( optionalTarget ) {

        var result = optionalTarget || new THREE.Vector2();
        return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

    },

    size: function ( optionalTarget ) {

        var result = optionalTarget || new THREE.Vector2();
        return result.subVectors( this.max, this.min );

    },

    expandByPoint: function ( point ) {

        this.min.min( point );
        this.max.max( point );

        return this;
    },

    expandByVector: function ( vector ) {

        this.min.sub( vector );
        this.max.add( vector );

        return this;
    },

    expandByScalar: function ( scalar ) {

        this.min.addScalar( -scalar );
        this.max.addScalar( scalar );

        return this;
    },

    containsPoint: function ( point ) {

        if ( point.x < this.min.x || point.x > this.max.x ||
             point.y < this.min.y || point.y > this.max.y ) {

            return false;

        }

        return true;

    },

    containsBox: function ( box ) {

        if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
             ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) ) {

            return true;

        }

        return false;

    },

    getParameter: function ( point, optionalTarget ) {

        // This can potentially have a divide by zero if the box
        // has a size dimension of 0.

        var result = optionalTarget || new THREE.Vector2();

        return result.set(
            ( point.x - this.min.x ) / ( this.max.x - this.min.x ),
            ( point.y - this.min.y ) / ( this.max.y - this.min.y )
        );

    },

    isIntersectionBox: function ( box ) {

        // using 6 splitting planes to rule out intersections.

        if ( box.max.x < this.min.x || box.min.x > this.max.x ||
             box.max.y < this.min.y || box.min.y > this.max.y ) {

            return false;

        }

        return true;

    },

    clampPoint: function ( point, optionalTarget ) {

        var result = optionalTarget || new THREE.Vector2();
        return result.copy( point ).clamp( this.min, this.max );

    },

    distanceToPoint: function () {

        var v1 = new THREE.Vector2();

        return function ( point ) {

            var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
            return clampedPoint.sub( point ).length();

        };

    }(),

    intersect: function ( box ) {

        this.min.max( box.min );
        this.max.min( box.max );

        return this;

    },

    union: function ( box ) {

        this.min.min( box.min );
        this.max.max( box.max );

        return this;

    },

    translate: function ( offset ) {

        this.min.add( offset );
        this.max.add( offset );

        return this;

    },

    equals: function ( box ) {

        return box.min.equals( this.min ) && box.max.equals( this.max );

    },

    clone: function () {

        return new THREE.Box2().copy( this );

    }

};



/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = JC;
    }
    exports.JC = JC;
} else if (typeof define !== 'undefined' && define.amd) {
    define(JC);
} else {
    root.JC = JC;
}

})(this);
