import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, filename } = await req.json();

    if (!file || !filename) {
      return new Response(
        JSON.stringify({ error: 'File and filename are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode base64 to binary
    const binaryString = atob(file);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let extractedText = '';

    // Simple text extraction for PDF (looking for text between stream markers)
    if (filename.toLowerCase().endsWith('.pdf')) {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const text = decoder.decode(bytes);
      
      // Basic PDF text extraction - looks for readable text
      const textMatches = text.match(/\(([^)]+)\)/g);
      if (textMatches) {
        extractedText = textMatches
          .map(match => match.slice(1, -1))
          .join(' ')
          .replace(/\\n/g, '\n')
          .replace(/\\/g, '');
      }
    } 
    // For DOCX - basic extraction (DOCX is a zip file)
    else if (filename.toLowerCase().endsWith('.docx')) {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const text = decoder.decode(bytes);
      
      // Try to find text content in the XML structure
      const textMatches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (textMatches) {
        extractedText = textMatches
          .map(match => {
            const content = match.match(/>([^<]+)</);
            return content ? content[1] : '';
          })
          .join(' ');
      }
    }

    if (!extractedText || extractedText.length < 50) {
      return new Response(
        JSON.stringify({ 
          error: 'Não foi possível extrair texto suficiente do arquivo. Por favor, copie e cole o texto manualmente.',
          text: ''
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ text: extractedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erro ao processar documento. Por favor, copie e cole o texto manualmente.',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
