import CollectionForm from '../CollectionForm'
import styles from '../../layout.module.css'

export const dynamic = 'force-dynamic'

export default function NewCollection() {
  return (
    <>
      <div className={styles.mainHeader}>
        <h1 className={styles.mainTitle}>New Collection</h1>
      </div>
      <CollectionForm />
    </>
  )
}
