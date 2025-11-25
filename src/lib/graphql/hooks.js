import { useQuery } from '@apollo/client/react';
import { companyByIdQuery, jobByIdQuery, jobsQuery } from './queries';

export const useCompany = (id) => {
  const { data, loading, error } = useQuery(companyByIdQuery, {
    variables: { id },
  });
  return { company: data?.company, loading, error: Boolean(error) };
};

export const useJob = (id) => {
  const { data, loading, error } = useQuery(jobByIdQuery, {
    variables: { id },
  });
  return { job: data?.job, loading, error: Boolean(error) };
};

export const useJobs = () => {
  const { data, loading, error } = useQuery(jobsQuery, {
    fetchPolicy: 'network-only',
  });
  console.log('Jobs:', data?.jobs);
  return { jobs: data?.jobs, loading, error: Boolean(error) };
};
