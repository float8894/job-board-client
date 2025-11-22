import { useParams } from 'react-router';
import { companyByIdQuery } from '../lib/graphql/queries';
import JobList from '../components/JobList';
import { useQuery } from '@apollo/client/react';

function CompanyPage() {
  const { companyId } = useParams();

  // const [company, setCompany] = useState();
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id: companyId },
  });

  console.log(`[CompanyPage]`, { data, loading, error });

  if (loading) return <div>Loading...</div>;
  if (error) return <div className='has-text-danger'>Data unavailable</div>;
  const { company } = data;
  return (
    <div>
      <h1 className='title'>{company.name}</h1>
      <div className='box'>{company.description}</div>
      <h2>Jobs at {company.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
