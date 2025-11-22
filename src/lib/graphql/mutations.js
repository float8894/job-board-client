// import { GraphQLClient, gql } from 'graphql-request';
import { getAccessToken } from '../auth';
import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { jobByIdQuery } from './queries';

const endpoint = 'http://localhost:9000/graphql';

// const client = new GraphQLClient(endpoint, {
//   headers: () => {
//     const accessToken = getAccessToken();
//     if (accessToken) return { Authorization: `Bearer ${accessToken}` };
//     return {};
//   },
// });

const httpLink = new HttpLink({ uri: endpoint });

const authLink = new SetContextLink(({ headers }) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }
  return { headers };
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export const createJob = async ({ title, description }) => {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        date
        title
        description
        company {
          id
          name
        }
      }
    }
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
