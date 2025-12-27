import React from 'react';
import PublicHeader from '../src/components/PublicHeader';
import PublicFooter from '../src/components/PublicFooter';
import Planos from '../src/pages/user/Planos';

export default function PlanosPublic() {
    return (
        <div>
            <PublicHeader />
            <div style={{ paddingTop: 80 }}>
                <Planos />
            </div>
            <PublicFooter />
        </div>
    );
}
