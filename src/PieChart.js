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
                colors={{ scheme: 'pastel1' }}
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