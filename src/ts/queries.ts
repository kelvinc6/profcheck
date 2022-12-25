import { gql } from 'graphql-request';

export const searchTeacherQuery = gql`
query NewSearchTeachersQuery($text: String!, $schoolID: ID!)
{
  newSearch {
    teachers(query: {text: $text, schoolID: $schoolID}) {
      edges {
        cursor
        node {
          id
          firstName
          lastName
          avgDifficulty
          avgRating
          department
          numRatings
          legacyId
          wouldTakeAgainPercent
        }
      }
    }
  }
}
`;

export const getTeacherQuery = gql`
query TeacherRatingsPageQuery(
  $id: ID!
) {
  node(id: $id) {
    ... on Teacher {
      id
      firstName
      lastName
      avgDifficulty
      avgRating
      department
      numRatings
      legacyId
      wouldTakeAgainPercent
    }
    id
  }
}
`;