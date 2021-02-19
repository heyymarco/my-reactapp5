import * as breakpoint from './breakpoints';



test('breakpoint.next', () => {
    if (breakpoint.next('xs') !== 'sm')     throw new Error('algoritm error');
    if (breakpoint.next('sm') !== 'md')     throw new Error('algoritm error');
    if (breakpoint.next('md') !== 'lg')     throw new Error('algoritm error');
    if (breakpoint.next('lg') !== 'xl')     throw new Error('algoritm error');
    if (breakpoint.next('xl') !== 'xxl')    throw new Error('algoritm error');
    if (breakpoint.next('xxl') !== undefined)  throw new Error('algoritm error');
});

test('breakpoint.min', () => {
    if (breakpoint.min('xs') !== null)      throw new Error('algoritm error');
    if (breakpoint.min('sm') !== 576)       throw new Error('algoritm error');
    if (breakpoint.min('md') !== 768)       throw new Error('algoritm error');
    if (breakpoint.min('lg') !== 992)       throw new Error('algoritm error');
    if (breakpoint.min('xl') !== 1200)      throw new Error('algoritm error');
    if (breakpoint.min('xxl') !== 1400)     throw new Error('algoritm error');
});

test('breakpoint.max', () => {
    if (breakpoint.max('xs') !== null)      throw new Error('algoritm error');
    if (breakpoint.max('sm') !== 575.98)    throw new Error('algoritm error');
    if (breakpoint.max('md') !== 767.98)    throw new Error('algoritm error');
    if (breakpoint.max('lg') !== 991.98)    throw new Error('algoritm error');
    if (breakpoint.max('xl') !== 1199.98)   throw new Error('algoritm error');
    if (breakpoint.max('xxl') !== 1399.98)  throw new Error('algoritm error');
});

test('breakpoint.infix', () => {
    if (breakpoint.infix('xs') !== null)    throw new Error('algoritm error');
    if (breakpoint.infix('sm') !== '-sm')   throw new Error('algoritm error');
    if (breakpoint.infix('md') !== '-md')   throw new Error('algoritm error');
    if (breakpoint.infix('lg') !== '-lg')   throw new Error('algoritm error');
    if (breakpoint.infix('xl') !== '-xl')   throw new Error('algoritm error');
    if (breakpoint.infix('xxl') !== '-xxl') throw new Error('algoritm error');
});

test('breakpoint.mediaUp', () => {
    for (const name in breakpoint.breakpoints) {
        const result: any = breakpoint.mediaUp(name, {
            '--test': 'ok',
        });

        if (name === 'xs') {
            if ( result?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else {
            if (!result?.[`@media (min-width: ${breakpoint.min(name)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (min-width: ${breakpoint.min(name)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
    } // for
});

test('breakpoint.mediaDown', () => {
    for (const name in breakpoint.breakpoints) {
        const result: any = breakpoint.mediaDown(name, {
            '--test': 'ok',
        });

        if (name === 'xs') {
            if ( result?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else {
            if (!result?.[`@media (max-width: ${breakpoint.max(name)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (max-width: ${breakpoint.max(name)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
    } // for
});

test('breakpoint.mediaBetween', () => {
    for (const name in breakpoint.breakpoints) {
        const nextName =  breakpoint.next(name);
        if (!nextName) continue;

        const result: any = breakpoint.mediaBetween(name, nextName, {
            '--test': 'ok',
        });

        if (breakpoint.min(name) && breakpoint.max(nextName)) {
            if (!result?.[`@media (min-width: ${breakpoint.min(name)}px) and (max-width: ${breakpoint.max(nextName)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (min-width: ${breakpoint.min(name)}px) and (max-width: ${breakpoint.max(nextName)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else if (breakpoint.min(name)) {
            if (!result?.[`@media (min-width: ${breakpoint.min(name)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (min-width: ${breakpoint.min(name)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else if (breakpoint.max(nextName)) {
            if (!result?.[`@media (max-width: ${breakpoint.max(nextName)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (max-width: ${breakpoint.max(nextName)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else {
            throw new Error('algoritm error');
        }
    } // for
});

test('breakpoint.mediaOnly', () => {
    for (const name in breakpoint.breakpoints) {
        const nextName =  breakpoint.next(name);
        if (!nextName) continue;

        const result: any = breakpoint.mediaOnly(name, {
            '--test': 'ok',
        });

        if (breakpoint.min(name) && breakpoint.max(nextName)) {
            if (!result?.[`@media (min-width: ${breakpoint.min(name)}px) and (max-width: ${breakpoint.max(nextName)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (min-width: ${breakpoint.min(name)}px) and (max-width: ${breakpoint.max(nextName)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else if (breakpoint.min(name)) {
            if (!result?.[`@media (min-width: ${breakpoint.min(name)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (min-width: ${breakpoint.min(name)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else if (breakpoint.max(nextName)) {
            if (!result?.[`@media (max-width: ${breakpoint.max(nextName)}px)`]) throw new Error('algoritm error');
            if ( result?.[`@media (max-width: ${breakpoint.max(nextName)}px)`]?.['--test'] !== 'ok') throw new Error('algoritm error');
        }
        else {
            throw new Error('algoritm error');
        }
    } // for
});