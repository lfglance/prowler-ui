import { useState, useMemo } from 'react';

const Table = ({ data, filters }) => {
    const _filters = JSON.parse(filters);
    const [showSummary, setShowSummary] = useState(true);

    const filteredData = useMemo(() => 
        data
            .filter((data) => data['STATUS'] !== 'PASS' || _filters.SHOW_PASSING)
            .filter((data) => !_filters.SEVERITY || data['SEVERITY'].includes(_filters.SEVERITY))
            .filter((data) => !_filters.SERVICE_NAME || data['SERVICE_NAME'].includes(_filters.SERVICE_NAME))
    , [data, filters]);

    const checkTitleSummary = useMemo(() => {
        const summary = filteredData.reduce((acc, row) => {
            const checkTitle = row.CHECK_TITLE;
            if (!acc[checkTitle]) {
                acc[checkTitle] = { 
                    count: 0, 
                    failures: 0, 
                    severities: {},
                    services: new Set()
                };
            }
            acc[checkTitle].count++;
            if (row.STATUS === 'FAIL') {
                acc[checkTitle].failures++;
                acc[checkTitle].severities[row.SEVERITY] = 
                    (acc[checkTitle].severities[row.SEVERITY] || 0) + 1;
            }
            acc[checkTitle].services.add(row.SERVICE_NAME);
            return acc;
        }, {});

        return Object.entries(summary)
            .map(([title, details]) => ({
                title, 
                ...details, 
                services: Array.from(details.services)
            }))
            .sort((a, b) => b.failures - a.failures);
    }, [filteredData]);

    return (
        <div className='dataTable'>
            <div className='table-controls'>
                <button onClick={() => setShowSummary(!showSummary)}>
                    {showSummary ? 'Show Detailed View' : 'Show Summary'}
                </button>
            </div>

            {showSummary ? (
                <div className='summary-view'>
                    <h3>Check Title Summary</h3>
                    {checkTitleSummary.map((summary, index) => (
                        <div 
                            key={index} 
                            className={`summary-item ${summary.failures > 0 ? 'failure-highlight' : ''}`}
                            style={{
                                backgroundColor: summary.failures > 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, .1)'
                            }}
                        >
                            <div className='summary-header'>
                                <strong>{summary.title}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                filteredData.map((row, index) => (
                    <span key={index} className={row.STATUS}>
                        <li className='finding'>
                            <div className='region'>{row.REGION} - {row.CHECK_TITLE} {row.STATUS === 'FAIL' && (<> - {row.SEVERITY.toUpperCase()}</>)}</div>
                            <div className='compliance'>{row.COMPLIANCE}</div>
                            <div className='resourceUID'>{row.RESOURCE_UID}</div>
                            <div className='statusExtended'>{row.STATUS_EXTENDED}</div>
                            {row.STATUS === 'FAIL' && (
                                <>
                                    <div className='resolution'>
                                        <p>{row.RISK}. {row.REMEDIATION_RECOMMENDATION_TEXT}</p>
                                        <a href={row.REMEDIATION_RECOMMENDATION_URL} target='_blank' rel="noreferrer">Read More</a>
                                    </div>
                                </>
                            )}
                        </li>
                    </span>
                ))
            )}
      </div>
    )
}

export default Table;