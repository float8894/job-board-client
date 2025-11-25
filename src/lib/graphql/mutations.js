// import { GraphQLClient, gql } from 'graphql-request';

import { gql } from '@apollo/client';
import { jobDetailFragment } from './queries';

export const createJobMutation = gql`
  mutation CreateJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${jobDetailFragment}
`;
