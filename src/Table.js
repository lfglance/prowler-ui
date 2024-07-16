// {
//   "AUTH_METHOD": "profile: None",
//   "TIMESTAMP": "2024-07-12 18:56:32.922137",
//   "ACCOUNT_UID": "111111111111",
//   "ACCOUNT_NAME": "",
//   "ACCOUNT_EMAIL": "",
//   "ACCOUNT_ORGANIZATION_UID": "",
//   "ACCOUNT_ORGANIZATION_NAME": "",
//   "ACCOUNT_TAGS": "",
//   "FINDING_UID": "prowler-aws-ecr_repositories_not_publicly_accessible-111111111111-us-west-2-ecs-sample/backend",
//   "PROVIDER": "aws",
//   "CHECK_ID": "ecr_repositories_not_publicly_accessible",
//   "CHECK_TITLE": "Ensure there are no ECR repositories set as Public",
//   "CHECK_TYPE": "Protect,Secure Access Management",
//   "STATUS": "PASS",
//   "STATUS_EXTENDED": "Repository ecs-sample/backend is not publicly accesible.",
//   "MUTED": "False",
//   "SERVICE_NAME": "ecr",
//   "SUBSERVICE_NAME": "",
//   "SEVERITY": "critical",
//   "RESOURCE_TYPE": "AwsEcrRepository",
//   "RESOURCE_UID": "arn:aws:ecr:us-west-2:111111111111:repository/ecs-sample/backend",
//   "RESOURCE_NAME": "ecs-sample/backend",
//   "RESOURCE_DETAILS": "",
//   "RESOURCE_TAGS": "copilot-application=ecs-sample | copilot-service=backend",
//   "PARTITION": "aws",
//   "REGION": "us-west-2",
//   "DESCRIPTION": "Ensure there are no ECR repositories set as Public",
//   "RISK": "A repository policy that allows anonymous access may allow anonymous users to perform actions.",
//   "RELATED_URL": "",
//   "REMEDIATION_RECOMMENDATION_TEXT": "Ensure the repository and its contents are not publicly accessible",
//   "REMEDIATION_RECOMMENDATION_URL": "https://docs.aws.amazon.com/AmazonECR/latest/public/security_iam_service-with-iam.html",
//   "REMEDIATION_CODE_NATIVEIAC": "https://docs.prowler.com/checks/aws/public-policies/public_1-ecr-repositories-not-public#cloudformation",
//   "REMEDIATION_CODE_TERRAFORM": "",
//   "REMEDIATION_CODE_CLI": "",
//   "REMEDIATION_CODE_OTHER": "https://docs.prowler.com/checks/aws/public-policies/public_1-ecr-repositories-not-public#aws-console",
//   "COMPLIANCE": "AWS-Well-Architected-Framework-Security-Pillar: SEC03-BP07",
//   "CATEGORIES": "internet-exposed",
//   "DEPENDS_ON": "",
//   "RELATED_TO": "",
//   "NOTES": "",
//   "PROWLER_VERSION": "4.2.4"
// }

  

const Table = ({ data, filters }) => {
    const _filters = JSON.parse(filters);
    return (
        <div className='dataTable'>
             {data
                .filter((data) => {
                    return data['STATUS'] !== 'PASS' || _filters.SHOW_PASSING
                })
                .filter((data) => {
                    if (!_filters.SEVERITY) return true
                    return data['SEVERITY'].includes(_filters.SEVERITY)
                })
                .filter((data) => {
                    if (!_filters.SERVICE_NAME) return true
                    return data['SERVICE_NAME'].includes(_filters.SERVICE_NAME)
                })
                .map((row, index) => (
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
                    )
                )}
      </div>
    )
}

export default Table;

