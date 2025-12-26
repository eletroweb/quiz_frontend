import React from 'react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import Planos from './user/Planos';

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
