import React from 'react';
import { getApiDocs } from '@/shared/lib/swagger';
import 'swagger-ui-react/swagger-ui.css';
import ReactSwagger from '@/shared/ui/react-swagger/ReactSwagger';

export default async function SwaggerPage() {
  const spec = await getApiDocs();
  return (
    <main className='p-4'>
      <ReactSwagger spec={spec} />
    </main>
  );
}
