import { h } from 'preact';
import { MultiSelect } from '../src/multi-select';
import { countries } from './countries';
import { query, shallow } from './preact-util';

const forceImportOfH = h;

describe('MultiSelect', () => {
    it('renders with empty values', () => {
        const tree = shallow(
            <MultiSelect
                valuesLabel='Selected Values'
                comboboxLabel='Add Value'
                values={[]}
                query={query}
                onChange={values => {
                    /* noop */
                }}
            />
        );
        expect(tree).toMatchSnapshot();
    });

    it('renders with values', () => {
        const tree = shallow(
            <MultiSelect
                valuesLabel='Selected Values'
                comboboxLabel='Add Value'
                values={[countries[0], countries[1]]}
                query={query}
                onChange={values => {
                    /* noop */
                }}
            />
        );
        expect(tree).toMatchSnapshot();
    });
});
