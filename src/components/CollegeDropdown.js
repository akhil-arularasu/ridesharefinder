import React from 'react';
import { Dropdown } from 'semantic-ui-react';

// Assuming each college has a unique numeric ID
const collegeOptions = [
  { key: 'Oxford', value: 1, text: 'Oxford College of Emory University' },
  { key: 'Emory', value: 2, text: 'Emory University Atlanta Campus' }
];

const CollegeDropdown = ({ value, onChange }) => (
  <Dropdown
      placeholder='Select College'
      fluid
      search
      selection
      options={collegeOptions}
      value={value}
      onChange={(e, data) => onChange(data.value)}
  />
);
export default CollegeDropdown;
