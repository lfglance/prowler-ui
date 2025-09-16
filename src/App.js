import { useState } from 'react';

import MyResponsivePie from './PieChart';
import Metadata from './data/metadata.json';
import RawData from './data/raw_data.json';
import Table from './Table';

function App() {
  const defaultFilters = {
    SHOW_PASSING: true
  }
  const [filters, setFilters] = useState(JSON.stringify(defaultFilters));
  const [data, setData] = useState(RawData);
  const [searchTerm, setSearchTerm] = useState('');

  const applyFilters = (newFilters, searchTermValue) => {
    const parsedFilters = typeof newFilters === 'string' ? JSON.parse(newFilters) : newFilters;

    const filteredData = RawData.filter((_data) => {
      // Severity filter
      if (parsedFilters.SEVERITY && !_data['SEVERITY'].includes(parsedFilters.SEVERITY)) return false;

      // Service Name filter
      if (parsedFilters.SERVICE_NAME && !_data['SERVICE_NAME'].includes(parsedFilters.SERVICE_NAME)) return false;

      // Region filter
      if (parsedFilters.REGION && !_data['REGION'].includes(parsedFilters.REGION)) return false;

      // Passing filter
      if (parsedFilters.SHOW_PASSING === false && _data['STATUS'] === 'PASS') return false;

      // Text search filter
      if (searchTermValue) {
        const searchLower = searchTermValue.toLowerCase();
        const searchFields = [
          'SEVERITY',
          'SERVICE_NAME',
          'REGION',
          'CHECK_TITLE',
          'RESOURCE_NAME',
          'STATUS_EXTENDED',
          'RISK',
          'COMPLIANCE'
        ];

        const matchFound = searchFields.some(field =>
          _data[field] &&
          _data[field].toString().toLowerCase().includes(searchLower)
        );

        if (!matchFound) return false;
      }

      return true;
    });

    setData(filteredData);
  }

  const handleFilterChange = (newFilters) => {
    setFilters(JSON.stringify(newFilters));
    applyFilters(newFilters, searchTerm);
  }

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    applyFilters(JSON.parse(filters), newSearchTerm);
  }

  const handleSliceClick = (slice, category) => {
    const newFilters = {
      ...JSON.parse(filters),
      [category]: slice.id
    }
    handleFilterChange(newFilters);
  };

  const clearAllFilters = (e) => {
    e.preventDefault();
    setSearchTerm('');
    handleFilterChange(defaultFilters);
    setData(RawData);
  }

  function summarizeFailuresByAttribute(data, attribute) {
    const summary = data
        .filter(entry => entry.STATUS === "FAIL")
        .reduce((acc, entry) => {
            const attrib = entry[attribute];
            if (!acc[attrib]) {
                acc[attrib] = { id: attrib, value: 0 };
            }
            acc[attrib].value += 1;
            return acc;
        }, {});

    return Object.keys(summary).map(region => ({
        id: region,
        value: summary[region].value
    }));
  }

  return (
    <div className='container'>
      <header>
        <h1>Prowler Scan Results</h1>
        <h3>AWS Account {Metadata.ACCOUNT_UID}</h3>
        <p>Prowler Version {Metadata.PROWLER_VERSION}</p>

        <div style={{marginTop: '10px'}}>
          <a href="https://github.com/lfglance/prowler-ui" target="_blank" rel="noreferrer">Source Code</a>
        </div>
      </header>

      <div className='grid-container'>
        <MyResponsivePie
          data={summarizeFailuresByAttribute(data, 'REGION')}
          title='Failures By Region'
          oc={(e) => handleSliceClick(e, 'REGION')}
        />
        <MyResponsivePie
          data={summarizeFailuresByAttribute(data, 'SERVICE_NAME')}
          title='Failures By Service'
          oc={(e) => handleSliceClick(e, 'SERVICE_NAME')}
        />
        <MyResponsivePie
          data={summarizeFailuresByAttribute(data, 'SEVERITY')}
          title='Failures By Severity'
          oc={(e) => handleSliceClick(e, 'SEVERITY')}
        />
      </div>

      <div className='tables'>
        <h2>Findings</h2>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <input
            type="text"
            placeholder="Search findings..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: '5px',
              width: '300px',
              marginRight: '10px'
            }}
          />
          <button onClick={clearAllFilters}>Clear All Filters</button>
        </div>
        <Table data={data} filters={filters} />
      </div>
    </div>
  );
}

export default App;