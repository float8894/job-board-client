// import { GraphQLClient } from 'graphql-request';
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { getAccessToken } from '../auth';
import { SetContextLink } from '@apollo/client/link/context';

export const jobDetailFragment = gql`
  fragment JobDetail on Job {
    id
    date
    title
    description
    company {
      id
      name
    }
  }
`;

export const companyDetailFragment = gql`
  fragment CompanyDetail on Company {
    id
    name
    description
    jobs {
      id
      title
      date
    }
  }
`;

export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      ...CompanyDetail
    }
  }
  ${companyDetailFragment}
`;

export const jobsQuery = gql`
  query ($limit: Int, $offset: Int) {
    jobs(limit: $limit, offset: $offset) {
      items {
        id
        title
        date
        company {
          id
          name
        }
      }
      totalCount
    }
  }
`;

const endpoint = 'http://localhost:9000/graphql';

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

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

export const getJob = async (id) => {
  // const { job } = await client.request(query, { id });
  const { data } = await apolloClient.query({
    query: jobByIdQuery,
    variables: { id },
  });

  return data.job;
};
