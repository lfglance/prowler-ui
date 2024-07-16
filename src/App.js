
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

  const handleFilterChange = (newFilters) => {
    setFilters(JSON.stringify(newFilters));
    setData(data
      .filter((_data) => {
        if ('SEVERITY' in newFilters) return _data['SEVERITY'].includes(newFilters.SEVERITY)
        return true
      })
      .filter((_data) => {
        if ('SERVICE_NAME' in newFilters) return _data['SERVICE_NAME'].includes(newFilters.SERVICE_NAME)
        return true
      })
      .filter((_data) => {
        if ('REGION' in newFilters) return _data['REGION'].includes(newFilters.REGION)
        return true
      })
      .filter((_data) => {
        if ('SHOW_PASSING' in newFilters) return true
        return true
      })
    )
  }

  const handleSliceClick = (slice, category) => {
    const newFilters = {
      ...JSON.parse(filters),
      [category]: slice.id
    }
    handleFilterChange(newFilters);
  };

  const clearFilters = (e) => {
    e.preventDefault();
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
        <p>Filters: {filters}</p>
        <button onClick={clearFilters}>Clear Filters</button>
        {JSON.parse(filters)['SHOW_PASSING'] === false && (
          <button href="" onClick={(e) => {
            e.preventDefault();
            handleFilterChange({
              ...JSON.parse(filters),
              SHOW_PASSING: true
            })
          }}>Show Passing</button>
        )}
        {JSON.parse(filters)['SHOW_PASSING'] === true && (
          <button onClick={(e) => {
            e.preventDefault();
            handleFilterChange({
              ...JSON.parse(filters),
              SHOW_PASSING: false
            })
          }}>Hide Passing</button>
        )}
        <div style={{marginTop: '10px'}}>
          <a href="https://github.com/lfglance/prowler-ui" target="_blank" rel="noreferrer">Source Code</a>
        </div>
      </header>
      <div className='grid-container'>
        <MyResponsivePie data={summarizeFailuresByAttribute(data, 'REGION')} title='Failures By Region' oc={(e) => handleSliceClick(e, 'REGION')} />
        <MyResponsivePie data={summarizeFailuresByAttribute(data, 'SERVICE_NAME')} title='Failures By Service' oc={(e) => handleSliceClick(e, 'SERVICE_NAME')} />
        <MyResponsivePie data={summarizeFailuresByAttribute(data, 'SEVERITY')} title='Failures By Severity' oc={(e) => handleSliceClick(e, 'SEVERITY')} />
      </div>
      <div className='tables'>
        <h2>Findings</h2>
        <Table data={data} filters={filters} />
      </div>
    </div>
  );
}

export default App;
