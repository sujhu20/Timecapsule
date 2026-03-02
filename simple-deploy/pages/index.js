export default function Home() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>TimeCapsule</h1>
      <p>
        Welcome to TimeCapsule - a secure way to send messages to the future. Create personalized time capsules with text, photos, videos, or documents.
      </p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px' }}>
          <h3>Create</h3>
          <p>Create personalized time capsules with text, photos, videos, or documents.</p>
        </div>
        
        <div style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px' }}>
          <h3>Encrypt</h3>
          <p>Your content is end-to-end encrypted, ensuring only intended recipients can access it.</p>
        </div>
        
        <div style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px' }}>
          <h3>Deliver</h3>
          <p>Schedule your capsules to be delivered on specific dates or under certain conditions.</p>
        </div>
      </div>
    </div>
  );
} 