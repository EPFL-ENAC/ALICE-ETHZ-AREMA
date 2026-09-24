import type { SubjectProfile } from '@/models';
import { useServices } from '@/stores/services';

// distinct affiliations of all author profiles, published or not
export function fetchAffiliations(): Promise<string[]> {
  return useServices()
    .make('subject-profile')
    .find({ $skip: 0, $limit: 1000 })
    .then((response) =>
      [
        ...new Set(
          (response.data as SubjectProfile[])
            .map((p) => p.affiliation?.trim())
            .filter((a): a is string => !!a),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    );
}
