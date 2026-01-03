import React from 'react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      <p className="mb-4">Última atualização: 02 de janeiro de 2026</p>
      <div className="mb-6">
        <a
          href="https://quizconcursos.com/politica"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Ver esta política no site principal
        </a>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Introdução</h2>
        <p className="text-gray-700">
          A sua privacidade é importante para nós. Esta Política de Privacidade explica como coletamos,
          usamos, armazenamos e protegemos suas informações pessoais quando você visita ou utiliza
          nosso site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Informações Coletadas</h2>
        <p className="text-gray-700">
          Podemos coletar informações pessoais fornecidas voluntariamente, como nome, e-mail, telefone
          e endereço, além de dados automáticos como endereço IP, tipo de navegador e páginas acessadas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Uso das Informações</h2>
        <p className="text-gray-700">
          As informações são utilizadas para melhorar nossos serviços, responder a solicitações,
          enviar comunicações relevantes e cumprir obrigações legais.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Compartilhamento de Dados</h2>
        <p className="text-gray-700">
          Não vendemos, trocamos ou transferimos suas informações pessoais a terceiros sem seu
          consentimento, exceto quando necessário para cumprir a lei ou proteger nossos direitos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Segurança</h2>
        <p className="text-gray-700">
          Adotamos medidas técnicas e organizacionais apropriadas para proteger suas informações
          contra acesso não autorizado, alteração, divulgação ou destruição.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Seus Direitos</h2>
        <p className="text-gray-700">
          Você tem o direito de acessar, corrigir, atualizar ou solicitar a exclusão de suas
          informações pessoais. Entre em contato conosco para exercer esses direitos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Cookies</h2>
        <p className="text-gray-700">
          Utilizamos cookies para melhorar a experiência do usuário. Você pode configurar seu
          navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8. Alterações a Esta Política</h2>
        <p className="text-gray-700">
          Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos que você
          revise esta página regularmente para estar ciente de quaisquer alterações.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">9. Contato</h2>
        <p className="text-gray-700">
          Em caso de dúvidas sobre esta Política de Privacidade, entre em contato conosco pelo
          e-mail: <a href="mailto:privacidade@quizconcursos.com" className="text-blue-600 hover:underline">privacidade@quizconcursos.com</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">10. Bases Legais (LGPD)</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Consentimento do titular.</li>
          <li>Cumprimento de obrigação legal ou regulatória.</li>
          <li>Execução de contrato ou de procedimentos preliminares relacionados a contrato.</li>
          <li>Exercício regular de direitos em processo judicial, administrativo ou arbitral.</li>
          <li>Proteção da vida ou da incolumidade física do titular ou de terceiro.</li>
          <li>Tutela da saúde.</li>
          <li>Interesse legítimo do controlador ou de terceiro, observado o equilíbrio com os direitos do titular.</li>
          <li>Proteção do crédito.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">11. Direitos dos Titulares</h2>
        <p className="text-gray-700">
          Você pode solicitar: confirmação da existência de tratamento, acesso aos dados, correção de dados incompletos ou desatualizados,
          anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos, portabilidade, informação sobre compartilhamentos, e
          revogação do consentimento.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">12. Encarregado/DPO</h2>
        <p className="text-gray-700">
          Nosso Encarregado/DPO pode ser contatado por e-mail em <a href="mailto:dpo@quizconcursos.com" className="text-blue-600 hover:underline">dpo@quizconcursos.com</a>.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">13. Retenção e Eliminação de Dados</h2>
        <p className="text-gray-700">
          Mantemos seus dados pelo tempo necessário para cumprir as finalidades do tratamento e exigências legais ou regulatórias.
          Após o período aplicável, dados são eliminados ou anonimizados de forma segura.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">14. Transferência Internacional de Dados</h2>
        <p className="text-gray-700">
          Seus dados podem ser transferidos para provedores localizados fora do Brasil. Garantimos salvaguardas adequadas, como cláusulas
          contratuais e padrões de segurança reconhecidos, em conformidade com a LGPD.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">15. Segurança da Informação</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Conexões criptografadas (SSL/TLS).</li>
          <li>Controles de acesso e autenticação.</li>
          <li>Monitoramento e registros de segurança.</li>
          <li>Práticas de minimização de dados.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">16. Cookies e Preferências</h2>
        <p className="text-gray-700">
          Você pode gerenciar preferências de cookies e privacidade no seu navegador. Alguns recursos podem depender desses cookies para
          oferecer melhor experiência de uso.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">17. Canal de Reclamações</h2>
        <p className="text-gray-700">
          Caso considere que seus direitos não foram observados, entre em contato pelo e-mail acima. Você também pode contatar a ANPD ou
          órgãos de defesa do consumidor.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">18. Vigência</h2>
        <p className="text-gray-700">
          Esta política entra em vigor na data indicada e poderá ser atualizada. A versão vigente estará sempre disponível em
          <a href="https://quizconcursos.com/politica" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> quizconcursos.com/politica</a>.
        </p>
      </section>
    </div>
  );
}

// Footer link component to be used in your layout/footer
export function FooterPrivacyLink() {
  return (
    <Link to="/politica" className="text-sm text-gray-600 hover:text-gray-900">
      Política de Privacidade
    </Link>
  );
}
