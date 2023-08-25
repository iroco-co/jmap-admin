export const seed = async (knex) => {
	await knex('user').insert([
		{
			email: 'amavis@test.iroco.co',
			firstname: 'amavis',
			lastname: '',
			password: '',
			password_code: '',
			vdomain_id: 1,
			role: 2
		},
		{
			email: 'adeline@test.iroco.co',
			firstname: 'Adeline',
			lastname: '',
			password:
				'{SHA512-CRYPT}$6$hxyVnwN.gQ72ZSr$suHNRMa4Ij71KZX4EdIxGtObqIuweJnbLs2KDV./9tOt53uWvJVaQfxXXwWBGMQacOVafTkM.hhH3aI1URMLV.',
			password_code:
				'{SHA512-CRYPT}$6$aPQq17lci$ssXSRD7dsqOIcTjzwUc11DSWmIbUDlNhP0Od58Y4ASnGn5X011Esr2AxVN7fkeoVBwVYkgmC2WFR1m2dmQq7n.',
			vdomain_id: 1,
			role: 2
		},
		{
			email: 'bruno@test.iroco.co',
			firstname: 'Bruno',
			lastname: '',
			password:
				'{SHA512-CRYPT}$6$JDQNegyqlW6$Mg2uyqxy8kDX0rHmOg73mNbnGXiCZNueKhFUA/wFSPeCZAEteJKr7PqdUcfLs4f1QRgapcv4JKZwMu5qmMA96.',
			password_code:
				'{SHA512-CRYPT}$6$aPQq17lci$ssXSRD7dsqOIcTjzwUc11DSWmIbUDlNhP0Od58Y4ASnGn5X011Esr2AxVN7fkeoVBwVYkgmC2WFR1m2dmQq7n.',
			vdomain_id: 1,
			role: 2
		},
		{
			email: 'sarah@test.iroco.co',
			firstname: 'Sarah',
			lastname: '',
			password:
				'{SHA512-CRYPT}$6$NerkDV4HRF$5Otng/7jpZV6CFAL4YytM4UcppmCDJYpvg1WzvgA1xZXmp796UtmHue/MdX1fLlPxV8tXxtbkkweh73WknMTj/',
			password_code:
				'{SHA512-CRYPT}$6$aPQq17lci$ssXSRD7dsqOIcTjzwUc11DSWmIbUDlNhP0Od58Y4ASnGn5X011Esr2AxVN7fkeoVBwVYkgmC2WFR1m2dmQq7n.',
			vdomain_id: 1,
			role: 2
		},
		{
			email: 'thomas@test.iroco.co',
			firstname: 'Thomas',
			lastname: '',
			password:
				'{SHA512-CRYPT}$6$TXBymif1ThV/4W$g8M0nOpAgoT38gvWO354sWkgEZrswkQRIMXJUWM.zwbSl/j3dj4TorVmwYgJE1S/b0yPE1Fh4qNxSL2PpDgZh.',
			password_code:
				'{SHA512-CRYPT}$6$aPQq17lci$ssXSRD7dsqOIcTjzwUc11DSWmIbUDlNhP0Od58Y4ASnGn5X011Esr2AxVN7fkeoVBwVYkgmC2WFR1m2dmQq7n.',
			vdomain_id: 1,
			role: 2
		}
	]);
};
