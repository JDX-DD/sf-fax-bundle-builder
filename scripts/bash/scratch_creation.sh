sf org create scratch --edition developer -a bundle_builder -d 
# 0A30e000000DkGKCA0  033i0000000VbWIAA0  RS Fax  efaxapp  04t1Y000000gfhVQAQ  1.31 
sf package install --package 04t1Y000000gfhVQAQ
sf org assign permset --name Bundle_Builder_Permission_Set
sf poject deploy start