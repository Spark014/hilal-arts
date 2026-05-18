import { getAdminCollectionById } from '../../../../../lib/services/admin'
import CollectionForm from '../../CollectionForm'
import { notFound } from 'next/navigation'
import styles from '../../../layout.module.css'

export const dynamic = 'force-dynamic'

export default async function EditCollection({ params }) {
  const { id } = params
  const collection = await getAdminCollectionById(id)
  
  if (!collection) {
    notFound()
  }
  
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>Edit: {collection.name}</h1>
      </div>
      <CollectionForm collection={collection} />
    </>
  )
}
