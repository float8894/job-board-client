// import { GraphQLClient, gql } from 'graphql-request';

import { gql } from '@apollo/client';
import { apolloClient, jobByIdQuery, jobDetailFragment } from './queries';

// const client = new GraphQLClient(endpoint, {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) return { Authorization: `Bearer ${accessToken}` };
//     return {};
//   },
// });

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${jobDetailFragment}
  `;
  // const { job } = await client.request(mutation, {
  //   input: { title, description },
  // });
  const { data } = await apolloClient.mutate({
    mutation,
    variables: { input: { title, description } },
    update: (cache, { data }) => {
      console.log('Data Check:', data);
      cache.writeQuery({
        query: jobByIdQuery,
        variables: { id: data.job.id },
        data,
      });
    },
  });
  return data.job;
};
