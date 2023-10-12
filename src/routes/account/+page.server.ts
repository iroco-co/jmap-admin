import type { PageServerLoad } from './$types'
import { FormStatus } from '../../domain'
import { getQuota } from '$lib/jmap'

export const load: PageServerLoad = async (event) => {
  const jwt = event.cookies.get('Authorization')
  if (jwt) {
    try {
      const jmapResponse = await getQuota(event.locals.email, jwt)
      return { jmapStatus: FormStatus.OK, quota: jmapResponse.list[0] }
    } catch (e) {
      return { jmapStatus: FormStatus.Error, key: 'err.jmap_error', message: e.message }
    }
  } else {
    return { jmapStatus: FormStatus.Error, key: 'err.no_jwt' }
  }
}
