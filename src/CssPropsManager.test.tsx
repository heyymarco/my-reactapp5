import CssPropsManager     from './CssPropsManager' // manages & updates the *css props* stored at specified `rule`.

// other supports:
import deepEqual           from 'deep-equal'



const testTransf = <TProps,TComp,TKfrm>(
    props   : TProps,
    compare : TComp,
    compKf  : TKfrm,
    prefix  = '',
    rule    = ':root'
) => {
    const css = new CssPropsManager(props, prefix, rule);
    css.refresh(true);



    const genProps = css.genProps;
    if (!deepEqual(genProps, compare)) {
        console.log(genProps);
        throw new Error('invalid');
    } // if



    const genKeyframes = css.genKeyframes;
    if (!deepEqual(genKeyframes, compKf)) {
        console.log(genKeyframes);
        throw new Error('invalid');
    } // if



    return [css, genProps, genKeyframes];
};



test('basic', () => {
    testTransf({
        red       : '#ff0000',
        green     : '#00ff00',
        blue      : '#0000ff',
    }, {
        '--red'   : '#ff0000',
        '--green' : '#00ff00',
        '--blue'  : '#0000ff',
    }, {
    });
});

test('with prefix', () => {
    testTransf({
        red          : '#ff0000',
        green        : '#00ff00',
        blue         : '#0000ff',
    }, {
        '--my-red'   : '#ff0000',
        '--my-green' : '#00ff00',
        '--my-blue'  : '#0000ff',
    }, {
    }, /*prefix :*/'my');
});

test('with @keyframes', () => {
    testTransf({
        red       : '#ff0000',
        green     : '#00ff00',
        blue      : '#0000ff',

        '@keyframes foo': {
            from: {
                opacity: 0.1,
            },
            to: {
                opacity: 0.9,
            },
        },
    }, {
        '--red'   : '#ff0000',
        '--green' : '#00ff00',
        '--blue'  : '#0000ff',

        '--keyframes-foo': 'foo',
    }, {
        '@keyframes foo': {
            from: {
                opacity: 0.1,
            },
            to: {
                opacity: 0.9,
            },
        },
    });
});

test('with prefix + keyframes', () => {
    testTransf({
        red          : '#ff0000',
        green        : '#00ff00',
        blue         : '#0000ff',

        '@keyframes foo': {
            from: {
                opacity: 0.1,
            },
            to: {
                opacity: 0.9,
            },
        },
    }, {
        '--my-red'   : '#ff0000',
        '--my-green' : '#00ff00',
        '--my-blue'  : '#0000ff',

        '--my-keyframes-foo': 'my-foo',
    }, {
        '@keyframes my-foo': {
            from: {
                opacity: 0.1,
            },
            to: {
                opacity: 0.9,
            },
        },
    }, /*prefix :*/'my');
});

test('with prefix + keyframes + ref', () => {
    testTransf({
        red       : '#ff0000',
        green     : '#00ff00',
        blue      : '#0000ff',
        startOpa  : 0.1,
        endOpa    : 0.9,

        favColor  : '#ff0000',
        yourColor : '#0000ff',

        '@keyframes foo': {
            from: {
                opacity: 0.1,
            },
            to: {
                opacity: 0.9,
            },
        },
    }, {
        '--my-red'       : '#ff0000',
        '--my-green'     : '#00ff00',
        '--my-blue'      : '#0000ff',

        '--my-startOpa'  : 0.1,
        '--my-endOpa'    : 0.9,

        '--my-favColor'  : 'var(--my-red)',
        '--my-yourColor' : 'var(--my-blue)',

        '--my-keyframes-foo': 'my-foo',
    }, {
        '@keyframes my-foo': {
            from: {
                opacity: 'var(--my-startOpa)',
            },
            to: {
                opacity: 'var(--my-endOpa)',
            },
        },
    }, /*prefix :*/'my');
});

test('with prefix + keyframes + ref + array', () => {
    testTransf({
        red       : '#ff0000',
        green     : '#00ff00',
        blue      : '#0000ff',
        startOpa  : 0.1,
        endOpa    : 0.9,

        favColor  : '#ff0000',
        yourColor : '#0000ff',

        border    : [[
            'solid',
            '1px',
            '#00ff00',
        ]],

        grad      : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],
        backgFun  : [
            [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],
            'transparent',
            '#0000ff',
        ],

        '@keyframes foo': {
            from: {
                opacity: 0.1,
            },
            to: {
                opacity: 0.9,
            },
        },
    }, {
        '--my-red'       : '#ff0000',
        '--my-green'     : '#00ff00',
        '--my-blue'      : '#0000ff',

        '--my-startOpa'  : 0.1,
        '--my-endOpa'    : 0.9,

        '--my-favColor'  : 'var(--my-red)',
        '--my-yourColor' : 'var(--my-blue)',

        '--my-border'    : [[
            'solid',
            '1px',
            'var(--my-green)',
        ]],

        '--my-grad'      : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],
        '--my-backgFun'  : [
            'var(--my-grad)',
            'transparent',
            'var(--my-blue)',
        ],

        '--my-keyframes-foo': 'my-foo',
    }, {
        '@keyframes my-foo': {
            from: {
                opacity: 'var(--my-startOpa)',
            },
            to: {
                opacity: 'var(--my-endOpa)',
            },
        },
    }, /*prefix :*/'my');
});

test('mutation with prefix + keyframes + ref + array', () => {
    const[css, genProps, genKeyframes] = testTransf({
        red       : '#ff000a',
        green     : '#00ff0a',
        blue      : '#a000ff',
        startOpa  : 0.1,
        endOpa    : 0.5,

        favColor  : '#ff0000',
        yourColor : '#0000ff',

        border    : [[
            'solid',
            '1px',
            '#00ff00',
        ]],

        grad      : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],
        backgFun  : [
            [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],
            'transparent',
            '#0000ff',
        ],

        '@keyframes foo': {
            from: {
                opacity: 0.1,
            },
            to: {
                opacity: 0.9,
            },
        },
    }, {
        '--my-red'       : '#ff000a',
        '--my-green'     : '#00ff0a',
        '--my-blue'      : '#a000ff',

        '--my-startOpa'  : 0.1,
        '--my-endOpa'    : 0.5,

        '--my-favColor'  : '#ff0000',
        '--my-yourColor' : '#0000ff',

        '--my-border'    : [[
            'solid',
            '1px',
            '#00ff00',
        ]],

        '--my-grad'      : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],
        '--my-backgFun'  : [
            'var(--my-grad)',
            'transparent',
            'var(--my-yourColor)',
        ],

        '--my-keyframes-foo': 'my-foo',
    }, {
        '@keyframes my-foo': {
            from: {
                opacity: 'var(--my-startOpa)',
            },
            to: {
                opacity: 0.9,
            },
        },
    }, /*prefix :*/'my');

    //@ts-ignore
    css.vals.red = '#ff0000';

    //@ts-ignore
    css.vals.green = '#00ff00';

    //@ts-ignore
    css.vals.blue = '#0000ff';

    //@ts-ignore
    css.vals.endOpa = 0.9;

    css.refresh(true);
    
    if (!deepEqual(css.genProps, {
        '--my-red'       : '#ff0000',
        '--my-green'     : '#00ff00',
        '--my-blue'      : '#0000ff',

        '--my-startOpa'  : 0.1,
        '--my-endOpa'    : 0.9,

        '--my-favColor'  : 'var(--my-red)',
        '--my-yourColor' : 'var(--my-blue)',

        '--my-border'    : [[
            'solid',
            '1px',
            'var(--my-green)',
        ]],

        '--my-grad'      : [['linear-gradient(180deg, rgba(255,255,255, 0.2), rgba(0,0,0, 0.2))', 'border-box']],
        '--my-backgFun'  : [
            'var(--my-grad)',
            'transparent',
            'var(--my-blue)',
        ],

        '--my-keyframes-foo': 'my-foo',
    })) throw new Error('invalid');

    if (!deepEqual(css.genKeyframes, {
        '@keyframes my-foo': {
            from: {
                opacity: 'var(--my-startOpa)',
            },
            to: {
                opacity: 'var(--my-endOpa)',
            },
        },
    })) throw new Error('invalid');
});