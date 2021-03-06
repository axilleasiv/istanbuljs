/* globals describe, it, context */

import { assert } from 'chai';
import Instrumenter from '../src/instrumenter';

const codeNeedDecoratorPlugin = `
  @decorator
  class MyClass {}
`;

const generateCode = (code, plugins) => {
    const opts = {
        esModules: true,
        produceSourceMap: true,
        plugins
    };
    const instrumenter = new Instrumenter(opts);
    return instrumenter.instrumentSync(code, __filename);
};

describe('plugins', () => {
    context('when the code has a decorator', () => {
        context('without decorator plugin', () => {
            it('should fail', done => {
                try {
                    generateCode(codeNeedDecoratorPlugin);
                } catch (e) {
                    const expected = `This experimental syntax requires enabling one of the following parser plugin(s): 'decorators-legacy, decorators'`;
                    assert.ok(e.message.includes(expected));
                    done();
                }
            });
        });

        context('with decorator plugin', () => {
            it('should success', () => {
                const generated = generateCode(codeNeedDecoratorPlugin, [
                    ['decorators', { decoratorsBeforeExport: false }]
                ]);
                assert.ok(generated);
                assert.ok(typeof generated === 'string');
            });
        });
    });
});
