import { ResponsivePie } from '@nivo/pie';


const MyResponsivePie = ({ data, title, oc }) => (
    <div className='grid-item'>
        <div className='chart-wrapper'>
            <h4>{title}</h4>
            <ResponsivePie
                data={data}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={1}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                 colors={(datum) => {
                     const severityColors = {
                         'critical': 'rgba(255, 0, 0, 0.35)',    // transparent red
                         'high': 'rgba(255, 127, 0, 0.35)',      // transparent orange
                         'medium': 'rgba(255, 255, 0, 0.35)',    // transparent yellow
                         'low': 'rgba(255, 255, 153, 0.35)'      // transparent light yellow
                     };

                     // If it's a severity level, return its color
                     const severityColor = severityColors[datum.id.toLowerCase()];
                     if (severityColor) return severityColor;

                     // For other fields, generate a random pastel color with transparency
                     const randomColor = () => Math.floor(Math.random() * 256);
                     const r = randomColor();
                     const g = randomColor();
                     const b = randomColor();
                     return `rgba(${r}, ${g}, ${b}, 0.35)`;
                 }}
                onClick={oc}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.5
                        ]
                    ]
                }}
                arcLinkLabelsSkipAngle={5}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            2
                        ]
                    ]
                }}
            />
        </div>
    </div>
)

export default MyResponsivePie;