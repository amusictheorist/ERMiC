export const musicianQuery = (limit, skip) =>`
{
  musicianCollection(limit: ${limit} skip: ${skip}) {
    items {
      slug
      firstName
      surname
      birthdate
      birthPlace
      deathdate
      deathPlace
      occupation
      worklistExtraInfo { json }
      writingListExtraInfo { json }
      performanceListExtraInfo { json }
      authorCollection {
        items {
          names
          surnames
        }
      }
      biography { json }
      bibliography { json }
      crossReferencesCollection {
        items {
          slug
          firstName
          surname
        }
      }
      photosCollection {
        items {
          url
          description
        }
      }
    }
  }
}`;

export const workQuery = (limit, skip) =>`
{
  workCollection(limit: ${limit}, skip: ${skip}) {
    items {
      musician {
        slug
      }
      title
      year
      dateRange
      type
      instrumentation
      publicationInfo { json }
    }
  }
}`;

export const writingQuery = (limit, skip) =>`
{
  writingCollection(limit: ${limit}, skip: ${skip}) {
    items {
      musician { slug }
      title
      type
      year
      dateRange
      publicationInfo { json }
    }
  }
}`;

export const performanceQuery = (limit, skip) =>`
{
  performanceAndMediaCollection(limit: ${limit}, skip: ${skip}) {
    items {
      musiciansCollection {
        items { slug }
      }
      title
      type
      year
      publicationInfo { json }
    }
  }
}`;