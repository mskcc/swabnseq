########! /opt/bin/Rscript --no-save --no-environ --no-restore --no-restore-history --slave# 2 parameters:
#! /opt/common/CentOS_7/R/R-3.6.1/bin/Rscript --no-save --no-environ --no-restore --no-restore-history --slave# 2 parameters:
#               in_filename
#               out_filename
#Usage: /opt/bin/Rscript taxhitsPie.R dist__hits_gte50_blastn_out_00004_buccal_GATCAG_L008_R2_020.fastq.gz_vs_nt.txt test.pdf
############input file format:###################################
#62301   9606    human   Homo_sapiens				#
#16969   9598    chimpanzee      Pan_troglodytes		#
#1925    32630   synthetic_construct     synthetic_construct	#
#################################################################

args <- commandArgs(TRUE)
in_filename = args[1]
out_filename = args[2]

orgs <- read.delim(in_filename,sep="\t",as.is=TRUE,header=FALSE, colClasses=c("numeric","numeric","character","character"), col.names=c("count","organismNumber","tax","lastcol"))
length<-length(orgs[,1])
print(length)
print(orgs[3])
#assume the last two columns are "hit_shorter_than_50" and "no_blast_hit"
orgs_new<- orgs[order(orgs$count[1:(length-2)], decreasing=TRUE),]
#sum up the counts ranked 10th and up, excluding the last two categories "hit_shorter_than_50" and "no_blast_hit"
count10thup<-sum(orgs_new$count[10:(length-2)])
totalqueries<-sum(orgs$count[1:length])
#totalhits<-sum(orgs$count[1:(length-2)])
orgs_top9hits<-orgs_new[-c(10:length), ]
orgs_10<-rbind(orgs_top9hits,data.frame(count=count10thup,organismNumber=0000,tax ="Misc",lastcol="Misc"))
nohit_shorthit<-orgs[-c(1:(length-2)), ]
orgs_final<-rbind(orgs_10,nohit_shorthit)
pdf(out_filename)
#add pie chart title based on input file name dist__hits_gte50_blastn_out_00004_buccal_GATCAG_L008_R2_020.fastq.gz_vs_nt.txt as 
#dist__hits_#gte50_blastn_out_00004_buccal_GATCAG_L008_R2_020
piechart_title<-strsplit(in_filename,'.fastq')[[1]][1]
#paste(piechart_title,"Total hits is",totalhits)
title<-paste(piechart_title,'\n',"Total number of query sequences:",totalqueries)
pie(orgs_final$count,labels=orgs_final$tax,cex=0.8,main=title)
garbage<-dev.off()
